/**
 * Seeds Sanity with the V2 page content that was first written in code.
 *
 *   npx sanity exec scripts/migrate-v2-content.ts --with-user-token -- <backup.json> [--dry]
 *
 * - Backs up every particuliersPage / proPage / geoPage document to <backup.json> first.
 * - Particuliers (all locales): new V2 fields, only where still empty.
 * - Pro (all locales): new label fields and process photo, only where empty.
 *   French pro pages: the validated V2 copy replaces the previous texts.
 * - Heat pump: one geoPage document per locale (routeKey 'pac'), created if missing.
 */
import fs from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'
import {V2, LANG as P_LANG} from '../src/content/particuliersV2'
import {PRO_COPY_FR, UI_V2, LANG as PRO_LANG, type ProSegmentKey} from '../src/content/proV2'
import {getPacGeoContent} from '../src/content/pacGeoContent'

type Locale = 'be-fr' | 'be-nl' | 'be-en' | 'fr-fr' | 'fr-en' | 'lu-fr' | 'lu-de' | 'lu-en'
const LOCALES: Locale[] = ['be-fr', 'be-nl', 'be-en', 'fr-fr', 'fr-en', 'lu-fr', 'lu-de', 'lu-en']
const FR_LOCALES: Locale[] = ['be-fr', 'fr-fr', 'lu-fr']
const SEGMENT_ID: Record<ProSegmentKey, string> = {
  pro_chauffagistes: 'chauffagistes',
  pro_architectes: 'architectes',
  pro_entrepreneurs: 'entrepreneurs',
}

const args = process.argv.slice(2).filter(a => a !== '--')
const dry = args.includes('--dry')
const backupPath = args.find(a => !a.startsWith('--'))
if (!backupPath) throw new Error('Usage: … -- <backup.json> [--dry]')

const client = getCliClient({apiVersion: '2025-08-15'})

// Array items need a _key, and the _type of the array member they belong to
const keyed = <T extends object>(list: T[], prefix: string, _type = 'object') =>
  list.map((item, i) => ({_key: `${prefix}${i + 1}`, _type, ...item}))

async function main() {
  const docs = await client.fetch(`*[_type in ["particuliersPage", "proPage", "geoPage"]]`)
  fs.writeFileSync(backupPath!, JSON.stringify(docs, null, 2))
  console.log(`Backup: ${docs.length} documents → ${path.resolve(backupPath!)}`)

  const byId = new Map<string, {_id: string; locale?: string}>(docs.map((d: {_id: string}) => [d._id, d]))
  const tx = client.transaction()
  let count = 0

  // Drone photo (works, process, heat pump hero)
  let droneRef = 'image-dry-run'
  if (!dry) {
    const asset = await client.assets.upload('image', fs.createReadStream('public/images/wdd-chantier-drone.jpg'), {
      filename: 'wdd-chantier-drone.jpg',
    })
    droneRef = asset._id
  }
  const drone = (alt: string) => ({_type: 'image', asset: {_type: 'reference', _ref: droneRef}, alt})

  // ── Particuliers: fill the new fields where empty
  for (const d of docs.filter((x: {_type: string}) => x._type === 'particuliersPage')) {
    const v = V2[P_LANG[d.locale as Locale] ?? 'fr']
    tx.patch(d._id, p => p.setIfMissing({
      contextUsps: keyed(v.usps, 'u', 'usp'),
      contextCtaLabel: v.ctaStudy,
      principleTitle: v.principleTitle,
      principleIntro: v.principleIntro,
      principleSteps: keyed(v.principleSteps, 'p', 'step'),
      principleCtaLabel: v.ctaSoil,
      siteTitle: v.siteTitle,
      siteIntro: v.siteIntro,
      siteSteps: keyed(v.siteSteps, 's', 'step'),
      siteCtaLabel: v.ctaStudy,
      siteImage: drone(v.siteImageAlt),
      calcCtaLabel: v.ctaQuote,
    }))
    count++
  }

  // ── Pro: labels and process photo for every locale (served documents only)
  for (const locale of LOCALES) {
    const ui = UI_V2[PRO_LANG[locale]]
    for (const segment of Object.keys(SEGMENT_ID) as ProSegmentKey[]) {
      const id = `proPage-${locale}-${SEGMENT_ID[segment]}`
      if (!byId.has(id)) continue
      tx.patch(id, p => p.setIfMissing({
        valueCtaLabel: ui.ctaAnalysis,
        understandGeoLabel: ui.understandGeo,
        processCtaLabel: ui.ctaAnalysis,
        processImage: drone(ui.processAlt),
      }))
      count++

      // French: the validated V2 copy replaces the previous texts
      if (FR_LOCALES.includes(locale)) {
        const c = PRO_COPY_FR[segment]
        tx.patch(id, p => p.set({
          valueTitle: c.contextTitle,
          valueIntro: c.contextIntro,
          valueUsps: keyed(c.usps, 'u'),
          whyTitle: c.whyTitle,
          valueItems: keyed(c.whyItems, 'w'),
          whyCtaLabel: ui.startProject,
          partnershipTitle: c.processTitle,
          partnershipIntro: c.processIntro,
          partnershipSteps: keyed(c.processSteps, 's'),
          ...(c.heroCtaPrimary ? {heroCtaLabel: c.heroCtaPrimary} : {}),
          ...(c.heroCtaSecondary ? {heroCtaSecondary: c.heroCtaSecondary} : {}),
          ...(c.heroSubtitle ? {heroSubtitle: c.heroSubtitle} : {}),
          ...(c.heroPanelItems ? {heroPanelItems: keyed(c.heroPanelItems, 'h')} : {}),
        }))
        count++
      }
    }
  }

  // ── Heat pump pages: one geoPage per locale
  for (const locale of LOCALES) {
    const {_id, locale: _l, routeKey: _r, heroRightImage: _h, advantages, faqs, ...content} = getPacGeoContent(locale)
    void _id; void _l; void _r; void _h
    const lang = PRO_LANG[locale]
    tx.createIfNotExists({
      _id: `geoPage-${locale}-pac`,
      _type: 'geoPage',
      locale,
      routeKey: 'pac',
      ...content,
      heroRightImage: drone({fr: 'Forage pour une pompe à chaleur géothermique', nl: 'Boring voor een geothermische warmtepomp', en: 'Drilling for a geothermal heat pump', de: 'Bohrung für eine Erdwärmepumpe'}[lang]),
      advantages: keyed(advantages ?? [], 'a', 'advantage'),
      faqs: keyed(faqs ?? [], 'f', 'faq'),
    })
    count++
  }

  if (dry) {
    console.log(`Dry run: ${count} mutations prepared, nothing written.`)
    console.log(JSON.stringify(tx.serialize().slice(0, 3), null, 2).slice(0, 3000))
    return
  }
  const res = await tx.commit()
  console.log(`Committed: ${res.results.length} mutations (transaction ${res.transactionId})`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
