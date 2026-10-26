// Import the blog articles restored from the old WordPress site into Sanity.
//
//   node scripts/import-legacy-blog.mjs <wp-content dir> [--dry-run] [--locale be-fr]
//
// Reads sanity-seed/blog-legacy/<locale>/*.json (generated from the WordPress
// SQL backup), uploads the featured + inline images from <wp-content dir>
// (the folder that holds uploads/), then createOrReplace each blogPost.
// Needs SANITY_API_TOKEN (Editor) in .env.local. Safe to re-run: document
// ids are stable and Sanity de-duplicates identical image uploads.

import {readFileSync, readdirSync, existsSync, createReadStream} from 'node:fs'
import {join, basename, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {writeClient, env} from './_sanityClient.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const wpContent = args.find((a) => !a.startsWith('--'))
const dryRun = args.includes('--dry-run')
const onlyLocale = args.includes('--locale') ? args[args.indexOf('--locale') + 1] : null

if (!wpContent || !existsSync(join(wpContent, 'uploads'))) {
  console.error('Usage: node scripts/import-legacy-blog.mjs <wp-content dir> [--dry-run] [--locale be-fr]')
  process.exit(1)
}
if (!dryRun && !env.SANITY_API_TOKEN) {
  console.error('SANITY_API_TOKEN (Editor) missing from .env.local')
  process.exit(1)
}

const seedDir = join(__dirname, '..', 'sanity-seed', 'blog-legacy')
const locales = readdirSync(seedDir).filter((d) => !d.startsWith('_') && (!onlyLocale || d === onlyLocale))

const uploaded = new Map()
async function uploadImage(relPath) {
  if (uploaded.has(relPath)) return uploaded.get(relPath)
  const file = join(wpContent, relPath)
  if (!existsSync(file)) {
    console.warn(`  ! image not found: ${relPath}`)
    return null
  }
  let ref = 'dry-run'
  if (!dryRun) {
    const asset = await writeClient.assets.upload('image', createReadStream(file), {filename: basename(file)})
    ref = asset._id
  }
  uploaded.set(relPath, ref)
  return ref
}

let count = 0
for (const locale of locales) {
  const files = readdirSync(join(seedDir, locale)).filter((f) => f.endsWith('.json'))
  console.log(`${locale}: ${files.length} articles`)
  for (const f of files) {
    const doc = JSON.parse(readFileSync(join(seedDir, locale, f), 'utf8'))
    const {_mainImageFile, _mainImageAlt, ...rest} = doc

    if (_mainImageFile) {
      const ref = await uploadImage(_mainImageFile)
      if (ref) rest.mainImage = {_type: 'image', asset: {_type: 'reference', _ref: ref}, alt: _mainImageAlt}
    }

    const body = []
    for (const block of rest.body || []) {
      if (block._type === 'image' && block._file) {
        const ref = await uploadImage(block._file)
        if (ref) body.push({_type: 'image', _key: block._key, alt: block.alt, asset: {_type: 'reference', _ref: ref}})
      } else {
        body.push(block)
      }
    }
    rest.body = body
    if (rest.readingTime == null) delete rest.readingTime

    if (!dryRun) await writeClient.createOrReplace(rest)
    count++
    console.log(`  ✓ ${rest.legacyPath || rest.slug.current}`)
  }
}
console.log(`${dryRun ? '[dry-run] ' : ''}${count} articles, ${uploaded.size} images`)
