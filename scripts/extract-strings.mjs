// Extract unique translatable strings from exported source docs into a
// dictionary skeleton: sanity-seed/_dict/<locale>.json = { "<fr>": "" }
import {walkStrings} from './_translatable.mjs'
import {readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = join(__dirname, '..', 'sanity-seed', '_source')
const DICT = join(__dirname, '..', 'sanity-seed', '_dict')
mkdirSync(DICT, {recursive: true})

const locales = ['be-fr', 'fr-fr', 'lu-fr']

for (const loc of locales) {
  const dir = join(SRC, loc)
  const strings = new Map() // fr -> count
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const doc = JSON.parse(readFileSync(join(dir, file), 'utf8'))
    walkStrings(doc, (key, value) => {
      strings.set(value, (strings.get(value) || 0) + 1)
      return undefined // don't mutate
    })
  }
  // Merge with existing dict (preserve already-filled translations)
  const outPath = join(DICT, `${loc}.json`)
  const existing = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : {}
  const sorted = [...strings.keys()].sort((a, b) => a.localeCompare(b))
  const out = {}
  for (const fr of sorted) out[fr] = existing[fr] || ''
  writeFileSync(outPath, JSON.stringify(out, null, 2))
  const filled = Object.values(out).filter(Boolean).length
  console.log(`${loc}: ${sorted.length} unique strings (${filled} already translated) -> _dict/${loc}.json`)
}
