'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {motion, AnimatePresence} from 'framer-motion'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import {routeMap} from '@/src/i18n/routes'
import {
  BELGIUM_PROVINCES,
  SVG_W,
  SVG_H,
  getProvinceName,
  getProvincePageUrl,
  getProvinceSlug,
  chantierImageUrl,
  TYPE_LABEL,
  SECTOR_LABEL,
  DEPTH_LABEL,
  localizedProvince,
  type Province,
  type Chantier,
} from '@/src/lib/referencesPage'

const CLAY = '#E8E5DE'
const ZOOM = 1.2

const COPY: Record<AppLocale, {
  backLink: string
  h1Line1: string
  desc: (provinceName: string) => string
  portfolioEyebrow: string
  projectsIn: (provinceName: string) => string
  projectCount: (n: number) => string
  otherProvinces: string
  ctaEyebrow: string; ctaTitle1: string; ctaTitle2: string; ctaButton: string
  tooltipLabel: string; tooltipClick: string
  emptyText: string; emptyButton: string
} | null> = {
  'be-fr': {
    backLink: 'Toutes les provinces',
    h1Line1: 'Géothermie',
    desc: (p) => `Découvrez nos chantiers géothermiques réalisés en ${p}.`,
    portfolioEyebrow: 'Portfolio',
    projectsIn: (p) => `Nos projets en`,
    projectCount: (n) => `${n} réalisation${n > 1 ? 's' : ''}`,
    otherProvinces: 'Autres provinces',
    ctaEyebrow: 'Votre projet', ctaTitle1: 'Prêt à lancer votre', ctaTitle2: 'chantier géothermique ?',
    ctaButton: 'Demandez un devis gratuit',
    tooltipLabel: 'Province', tooltipClick: 'Cliquer pour explorer →',
    emptyText: 'Aucun projet référencé dans cette province pour le moment.',
    emptyButton: 'Lancez votre projet',
  },
  'be-nl': {
    backLink: 'Alle provincies',
    h1Line1: 'Geothermie',
    desc: (p) => `Ontdek onze geothermische werven uitgevoerd in ${p}.`,
    portfolioEyebrow: 'Portfolio',
    projectsIn: (p) => `Onze projecten in`,
    projectCount: (n) => `${n} realisatie${n > 1 ? 's' : ''}`,
    otherProvinces: 'Andere provincies',
    ctaEyebrow: 'Uw project', ctaTitle1: 'Klaar om uw', ctaTitle2: 'geothermisch project te starten?',
    ctaButton: 'Vraag een gratis offerte aan',
    tooltipLabel: 'Provincie', tooltipClick: 'Klikken om te verkennen →',
    emptyText: 'Momenteel geen projecten in deze provincie.',
    emptyButton: 'Start uw project',
  },
  'fr-fr': null,
  'lu-fr': null,
  'lu-de': null,
}

export default function ProvinceReferencesPage({
  locale,
  province,
  chantiers,
}: {
  locale: AppLocale
  province: Province
  chantiers: Chantier[]
}) {
  const copy = COPY[locale]
  if (!copy) {
    return (
      <div className="flex flex-col min-h-screen bg-wdd-clay items-center justify-center px-8 py-32">
        <Link
          href={getLocalizedPath(locale, 'references')}
          className="text-sm font-light text-wdd-black/50 hover:text-wdd-black transition-colors"
        >
          ← Retour
        </Link>
      </div>
    )
  }

  return <ProvincePage locale={locale} province={province} chantiers={chantiers} copy={copy} />
}

/* ── Full province page ───────────────────────────────────────── */

function ProvincePage({locale, province, chantiers, copy}: {
  locale: AppLocale
  province: Province
  chantiers: Chantier[]
  copy: NonNullable<(typeof COPY)[AppLocale]>
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  const router = useRouter()

  const referencesHref = `/${locale}/${routeMap[locale].references}`

  const [cx, cy] = province.centroid
  const tx = `${(0.5 - cx / SVG_W) * ZOOM * 100}%`
  const ty = `${(0.5 - cy / SVG_H) * ZOOM * 100}%`

  const provinceChantiers = chantiers.filter(
    (c) =>
      c.province === province.slug ||
      c.province?.toLowerCase().includes(province.nameFr.toLowerCase()) ||
      c.province?.toLowerCase().includes(province.nameNl.toLowerCase()),
  )
  const displayChantiers = provinceChantiers.length > 0 ? provinceChantiers : chantiers

  const provinceName = getProvinceName(province, locale)

  return (
    <div className="flex flex-col bg-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="h-[44vh] relative overflow-hidden" style={{backgroundColor: CLAY}}>

        <div className="hidden lg:block absolute right-[18%] w-[38%]" style={{top: '-24vh', height: '72vh'}}>
          <motion.svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
            style={{transformOrigin: '50% 50%', scale: ZOOM, x: tx, y: ty}}
          >
            {BELGIUM_PROVINCES.map((p) => (
              <path
                key={p.id}
                d={p.path}
                fill={p.id === province.id || p.id === hovered ? '#FFD950' : 'transparent'}
                stroke="#B0A89E"
                strokeWidth={0.3}
                strokeLinejoin="round"
                style={{cursor: 'pointer', transition: 'fill 0.15s', pointerEvents: 'all'}}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  if (p.id !== province.id) router.push(getProvincePageUrl(locale, getProvinceSlug(p, locale)))
                }}
              />
            ))}
          </motion.svg>
        </div>

        <motion.div
          className="relative h-full flex flex-col justify-center px-8 md:px-16 pointer-events-none"
          style={{zIndex: 10000}}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.35, ease: [0.32, 0, 0.24, 1]}}
        >
          <div className="max-w-screen-2xl mx-auto w-full">
            <div className="lg:w-1/2 lg:pr-16 pointer-events-auto">

              <Link
                href={referencesHref}
                className="inline-flex items-center gap-2 text-xs font-light text-wdd-black/40 hover:text-wdd-black transition-colors mb-6"
              >
                <span>←</span>
                <span>{copy.backLink}</span>
              </Link>

              <h1 className="text-4xl md:text-5xl font-bold text-wdd-black leading-none mb-4">
                <span className="block">{copy.h1Line1}</span>
                <span className="block">
                  {locale === 'be-nl' ? 'in' : province.prepFr}{' '}
                  <span className="text-wdd-mud">{provinceName}</span>
                </span>
              </h1>

              <p className="text-sm font-light text-wdd-black/65 leading-relaxed">
                {copy.desc(provinceName)}
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {hovered && hovered !== province.id && (
            <motion.div
              key={hovered}
              initial={{opacity: 0, y: 6}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: 4}}
              transition={{duration: 0.12}}
              className="absolute bottom-8 right-8 bg-wdd-black text-white px-4 py-3 pointer-events-none"
              style={{zIndex: 10000}}
            >
              <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-0.5">
                {copy.tooltipLabel}
              </div>
              <div className="text-sm font-bold leading-none">
                {getProvinceName(BELGIUM_PROVINCES.find((p) => p.id === hovered)!, locale)}
              </div>
              <div className="text-[10px] font-light text-wdd-yellow mt-1">
                {copy.tooltipClick}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── CHANTIERS ─────────────────────────────────────────── */}
      <section className="bg-white py-24 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-0.5 bg-wdd-yellow" />
            <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">
              {copy.portfolioEyebrow}
            </span>
          </div>

          <div className="flex items-end justify-between mb-12 gap-4">
            <h2 className="text-4xl font-bold leading-tight">
              {copy.projectsIn(provinceName)}{' '}
              <span className="text-wdd-mud">{provinceName}</span>
            </h2>
            {displayChantiers.length > 0 && (
              <span className="text-sm font-light text-black/40 shrink-0">
                {copy.projectCount(displayChantiers.length)}
              </span>
            )}
          </div>

          {displayChantiers.length === 0 ? (
            <EmptyState copy={copy} locale={locale} />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5">
              {displayChantiers.map((c) => (
                <ChantierCard key={c._id} chantier={c} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── OTHER PROVINCES ───────────────────────────────────── */}
      <section className="bg-wdd-clay py-16 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-5 h-0.5 bg-wdd-yellow" />
            <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">
              {copy.otherProvinces}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {BELGIUM_PROVINCES.filter((p) => p.id !== province.id).map((p) => (
              <Link
                key={p.id}
                href={getProvincePageUrl(locale, getProvinceSlug(p, locale))}
                className="px-4 py-2 text-sm font-light text-wdd-black/60 border border-wdd-black/15 hover:bg-wdd-black hover:text-wdd-yellow hover:border-wdd-black transition-colors"
              >
                {getProvinceName(p, locale)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-wdd-clay py-20 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto text-center">
          <div className="text-xs font-light tracking-widest text-wdd-black/30 uppercase mb-4">
            {copy.ctaEyebrow}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-wdd-black mb-8 leading-tight">
            {copy.ctaTitle1}
            <br />
            <span className="text-wdd-mud">{copy.ctaTitle2}</span>
          </h2>
          <Link
            href={getLocalizedPath(locale, 'demarrer')}
            className="inline-block bg-wdd-black text-white px-8 py-4 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
          >
            {copy.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  )
}

/* ─── Project card ─────────────────────────────────────────── */

function ChantierCard({chantier: c, locale}: {chantier: Chantier; locale: AppLocale}) {
  const imgUrl = chantierImageUrl(c.photo, 600)
  const href = c.slug ? getProvincePageUrl(locale, c.slug) : undefined

  const inner = (
    <div className="group bg-wdd-clay relative overflow-hidden flex flex-col hover:bg-wdd-black transition-colors duration-200 h-full">
      {imgUrl ? (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imgUrl}
            alt={c.title ?? 'Projet WellDoneDrill'}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="h-48 bg-black/8 group-hover:bg-white/5 flex items-center justify-center transition-colors">
          <span className="text-2xl font-bold text-black/10 group-hover:text-white/10 select-none">
            WDD
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col gap-3 flex-1 relative overflow-hidden">
        <span className="absolute top-4 right-4 text-4xl font-bold text-black/5 group-hover:text-white/5 transition-colors select-none">
          {c.year ?? '—'}
        </span>

        <div className="flex flex-wrap gap-1.5">
          {c.type && (
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                c.type === 'fermee'
                  ? 'bg-wdd-yellow text-wdd-black'
                  : 'bg-wdd-black text-wdd-yellow group-hover:bg-wdd-yellow group-hover:text-wdd-black'
              } transition-colors`}
            >
              {TYPE_LABEL[locale][c.type as 'fermee' | 'ouverte'] ?? c.type}
            </span>
          )}
          {c.sector && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black/8 text-black/50 group-hover:bg-white/10 group-hover:text-white/50 transition-colors">
              {SECTOR_LABEL[locale][c.sector] ?? c.sector}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold leading-snug group-hover:text-white transition-colors">
          {c.title ?? 'Projet géothermique'}
        </h3>

        {(c.location || c.province) && (
          <p className="text-xs font-light text-black/50 group-hover:text-white/45 transition-colors">
            {[c.location, localizedProvince(c.province, locale)].filter(Boolean).join(' · ')}
          </p>
        )}

        {c.depth && (
          <p className="text-xs font-light text-black/40 group-hover:text-white/35 transition-colors mt-auto pt-2 border-t border-black/8 group-hover:border-white/8">
            {DEPTH_LABEL[locale]} : <span className="font-bold">{c.depth} m</span>
          </p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-wdd-yellow scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </div>
  )

  return href ? (
    <Link href={href} className="flex flex-col">{inner}</Link>
  ) : inner
}

/* ─── Empty state ──────────────────────────────────────────── */

function EmptyState({copy, locale}: {copy: NonNullable<(typeof COPY)[AppLocale]>; locale: AppLocale}) {
  return (
    <div className="border border-dashed border-black/15 p-16 text-center">
      <div className="text-sm font-light text-black/35 mb-4">
        {copy.emptyText}
      </div>
      <Link
        href={getLocalizedPath(locale, 'demarrer')}
        className="inline-block bg-wdd-black text-wdd-yellow px-6 py-3 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
      >
        {copy.emptyButton}
      </Link>
    </div>
  )
}
