// Import all EN seed docs (sanity-seed/en/**) into the production dataset.
// New IDs only (be-en/fr-en/lu-en) — never touches existing FR/NL/DE docs.
import {writeClient} from './_sanityClient.mjs'
import {readdirSync, readFileSync, statSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'sanity-seed', 'en')

function walkFiles(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walkFiles(p))
    else if (name.endsWith('.json')) out.push(p)
  }
  return out
}

const files = walkFiles(OUT)
console.log(`Found ${files.length} EN docs to import.`)

const DRY = process.argv.includes('--dry')
let tx = writeClient.transaction()
let n = 0
for (const f of files) {
  const doc = JSON.parse(readFileSync(f, 'utf8'))
  if (!doc._id || !doc.locale?.endsWith('-en')) {
    console.warn('SKIP (no id / not -en):', f)
    continue
  }
  tx = tx.createOrReplace(doc)
  n++
}

if (DRY) {
  console.log(`[dry-run] would createOrReplace ${n} docs. No write performed.`)
} else {
  const res = await tx.commit()
  console.log(`Committed ${n} docs. Transaction ${res.transactionId}`)
}
