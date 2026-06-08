// Build EN seed docs from source FR docs + translation dictionaries.
// be-fr -> be-en, fr-fr -> fr-en, lu-fr -> lu-en.
// Rewrites _id (locale token), locale field; translates strings via dict.
import {walkStrings} from './_translatable.mjs'
import {readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync, rmSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = join(__dirname, '..', 'sanity-seed', '_source')
const DICT = join(__dirname, '..', 'sanity-seed', '_dict')
const OUT = join(__dirname, '..', 'sanity-seed', 'en')

const MAP = [
  {from: 'be-fr', to: 'be-en'},
  {from: 'fr-fr', to: 'fr-en'},
  {from: 'lu-fr', to: 'lu-en'},
]

rmSync(OUT, {recursive: true, force: true})
mkdirSync(OUT, {recursive: true})

const missing = {} // locale -> [strings]
let total = 0

for (const {from, to} of MAP) {
  const dict = JSON.parse(readFileSync(join(DICT, `${from}.json`), 'utf8'))
  const dir = join(SRC, from)
  if (!existsSync(dir)) continue
  const outDir = join(OUT, to)
  mkdirSync(outDir, {recursive: true})
  const miss = new Set()

  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const doc = JSON.parse(readFileSync(join(dir, file), 'utf8'))

    // Rewrite identifiers + strip Sanity-internal metadata
    doc.locale = to
    if (typeof doc._id === 'string') doc._id = doc._id.split(from).join(to)
    delete doc._rev
    delete doc._createdAt
    delete doc._updatedAt
    delete doc._system

    walkStrings(doc, (key, value) => {
      const t = dict[value]
      if (t && t.trim()) return t
      miss.add(value)
      return undefined // keep source (FR) as last-resort fallback
    })

    const safeId = doc._id.replace(/[^a-zA-Z0-9_-]/g, '_')
    writeFileSync(join(outDir, `${doc._type}__${safeId}.json`), JSON.stringify(doc, null, 2))
    total++
  }
  missing[from] = [...miss]
  const filled = Object.values(dict).filter(Boolean).length
  console.log(`${from} -> ${to}: dict ${filled}/${Object.keys(dict).length} filled, ${miss.size} strings still untranslated in docs`)
}

writeFileSync(join(DICT, '_missing.json'), JSON.stringify(missing, null, 2))
console.log(`\nWrote ${total} EN seed docs to sanity-seed/en/`)
console.log('Untranslated strings listed in sanity-seed/_dict/_missing.json')
