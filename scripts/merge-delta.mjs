// Merge a delta dict (FR->EN) into a locale dict, filling only empty values.
// Usage: node scripts/merge-delta.mjs <locale> <deltaFile>
import {readFileSync, writeFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DICT = join(__dirname, '..', 'sanity-seed', '_dict')

const [, , locale, deltaFile] = process.argv
const p = join(DICT, `${locale}.json`)
const d = JSON.parse(readFileSync(p, 'utf8'))
const delta = JSON.parse(readFileSync(join(DICT, deltaFile), 'utf8'))

let filled = 0, unknown = 0
for (const [k, v] of Object.entries(delta)) {
  if (!(k in d)) { unknown++; console.warn('  not a key in dict:', JSON.stringify(k.slice(0, 60))); continue }
  if (v) { d[k] = v; filled++ }
}
writeFileSync(p, JSON.stringify(d, null, 2))
const remaining = Object.values(d).filter((x) => !x).length
console.log(`${locale}: merged ${filled} from delta (${unknown} unknown keys). ${remaining} still empty.`)
