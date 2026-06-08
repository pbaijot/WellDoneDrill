// Dumps source French docs (be-fr, fr-fr, lu-fr) to sanity-seed/_source/<locale>/
import {readClient} from './_sanityClient.mjs'
import {mkdirSync, writeFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'sanity-seed', '_source')

const LOCALES = ['be-fr', 'fr-fr', 'lu-fr']

const docs = await readClient.fetch(
  `*[locale in $locales && !(_id in path("drafts.**"))]{...}`,
  {locales: LOCALES},
)

const byLocale = {}
for (const d of docs) {
  const loc = d.locale
  byLocale[loc] = (byLocale[loc] || 0) + 1
  const dir = join(OUT, loc)
  mkdirSync(dir, {recursive: true})
  const safeId = d._id.replace(/[^a-zA-Z0-9_-]/g, '_')
  writeFileSync(join(dir, `${d._type}__${safeId}.json`), JSON.stringify(d, null, 2))
}

console.log('Exported counts by locale:', byLocale)
console.log('By type:')
const byType = {}
for (const d of docs) byType[`${d.locale}/${d._type}`] = (byType[`${d.locale}/${d._type}`] || 0) + 1
console.log(JSON.stringify(byType, null, 1))
