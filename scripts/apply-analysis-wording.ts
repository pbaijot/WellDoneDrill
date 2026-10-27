/**
 * Replaces "étude / study / Studie" offer wording with "analyse / analysis / Analyse"
 * in the page documents (not blog posts or project pages, where "study" is used in its plain sense).
 *
 *   npx sanity exec scripts/apply-analysis-wording.ts --with-user-token -- <backup.json> [--dry]
 */
import fs from 'node:fs'
import {getCliClient} from 'sanity/cli'
import pairs from './analysis-wording.json'

const args = process.argv.slice(2).filter(a => a !== '--')
const dry = args.includes('--dry')
const backupPath = args.find(a => !a.startsWith('--'))
if (!backupPath) throw new Error('Usage: … -- <backup.json> [--dry]')

const client = getCliClient({apiVersion: '2025-08-15'})
const TYPES = ['particuliersPage', 'proPage', 'geoPage', 'demarrerPage', 'homePage', 'globalSettings', 'aProposPage', 'sitePage']

const replaceAll = (s: string) => (pairs as [string, string][]).reduce((acc, [a, b]) => acc.split(a).join(b), s)

function rewrite(value: unknown): unknown {
  if (typeof value === 'string') return replaceAll(value)
  if (Array.isArray(value)) return value.map(rewrite)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k.startsWith('_') ? v : rewrite(v)]))
  }
  return value
}

async function main() {
  const docs = await client.fetch(`*[_type in $types && !(_id in path("drafts.**"))]`, {types: TYPES})
  fs.writeFileSync(backupPath!, JSON.stringify(docs, null, 2))
  console.log(`Backup: ${docs.length} documents → ${backupPath}`)
  const tx = client.transaction()
  let changed = 0
  for (const doc of docs) {
    const set: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(doc)) {
      if (key.startsWith('_')) continue
      const next = rewrite(value)
      if (JSON.stringify(next) !== JSON.stringify(value)) set[key] = next
    }
    if (Object.keys(set).length) {
      tx.patch(doc._id, p => p.set(set))
      changed++
      console.log(doc._id, Object.keys(set).join(', '))
    }
  }
  if (dry || !changed) return console.log(`${dry ? 'Dry run' : 'Nothing to do'}: ${changed} documents`)
  const res = await tx.commit()
  console.log(`Committed: ${res.results.length} documents updated`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
