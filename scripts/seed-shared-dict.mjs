// Pre-fill fr-fr.json and lu-fr.json from be-fr.json for keys that are identical
// (shared strings). Leaves country-specific strings empty for manual translation.
import {readFileSync, writeFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DICT = join(__dirname, '..', 'sanity-seed', '_dict')

const be = JSON.parse(readFileSync(join(DICT, 'be-fr.json'), 'utf8'))

for (const loc of ['fr-fr', 'lu-fr']) {
  const p = join(DICT, `${loc}.json`)
  const d = JSON.parse(readFileSync(p, 'utf8'))
  let filled = 0
  let remaining = 0
  for (const k of Object.keys(d)) {
    if (!d[k] && be[k]) { d[k] = be[k]; filled++ }
    if (!d[k]) remaining++
  }
  writeFileSync(p, JSON.stringify(d, null, 2))
  console.log(`${loc}: pre-filled ${filled} shared, ${remaining} still need translation`)
}
