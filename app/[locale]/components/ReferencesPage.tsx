'use client'

import {useState, useCallback} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {motion, AnimatePresence, type Transition} from 'framer-motion'
import type {AppLocale} from '@/src/i18n/routes'
import {getLocalizedPath} from '@/src/i18n/routes'
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

const COPY: Record<AppLocale, {
  h1Line1: string; h1Line2: string; h1Line3: string
  desc: string
  portfolioEyebrow: string; allProjects: string
  projectCount: (n: number) => string
  ctaEyebrow: string; ctaTitle1: string; ctaTitle2: string; ctaButton: string
  tooltipLabel: string; tooltipClick: string
} | null> = {
  'be-fr': {
    h1Line1: 'Géothermie', h1Line2: 'partout en', h1Line3: 'Belgique',
    desc: "Depuis 2009, WellDoneDrill fore des champs géothermiques sur l'ensemble du territoire belge. Sélectionnez votre province pour découvrir nos réalisations.",
    portfolioEyebrow: 'Portfolio', allProjects: 'Tous nos projets',
    projectCount: (n) => `${n} réalisation${n > 1 ? 's' : ''}`,
    ctaEyebrow: 'Votre projet', ctaTitle1: 'Prêt à lancer votre', ctaTitle2: 'chantier géothermique ?',
    ctaButton: 'Demandez un devis gratuit',
    tooltipLabel: 'Province', tooltipClick: 'Cliquer pour explorer →',
  },
  'be-nl': {
    h1Line1: 'Geothermie', h1Line2: 'overal in', h1Line3: 'België',
    desc: "Sinds 2009 boort WellDoneDrill geothermische velden op het volledige Belgische grondgebied. Selecteer uw provincie om onze realisaties te ontdekken.",
    portfolioEyebrow: 'Portfolio', allProjects: 'Alle projecten',
    projectCount: (n) => `${n} realisatie${n > 1 ? 's' : ''}`,
    ctaEyebrow: 'Uw project', ctaTitle1: 'Klaar om uw', ctaTitle2: 'geothermisch project te starten?',
    ctaButton: 'Vraag een gratis offerte aan',
    tooltipLabel: 'Provincie', tooltipClick: 'Klikken om te verkennen →',
  },
  'fr-fr': null,
  'lu-fr': null,
  'lu-de': null,
}

const COMING_SOON: Record<AppLocale, {title: string; sub: string; cta: string} | null> = {
  'be-fr': null,
  'be-nl': null,
  'fr-fr': {
    title: 'Nos références en France arrivent bientôt.',
    sub: "Nous développons activement nos activités en France. Contactez-nous pour discuter de votre projet géothermique.",
    cta: 'Contactez-nous',
  },
  'lu-fr': {
    title: 'Nos références au Luxembourg arrivent bientôt.',
    sub: "Nous développons activement nos activités au Luxembourg. Contactez-nous pour discuter de votre projet géothermique.",
    cta: 'Contactez-nous',
  },
  'lu-de': {
    title: 'Unsere Referenzen in Luxemburg kommen bald.',
    sub: "Wir bauen unsere Aktivitäten in Luxemburg aktiv aus. Kontaktieren Sie uns, um Ihr Geothermieprojekt zu besprechen.",
    cta: 'Kontaktieren Sie uns',
  },
}

const CLAY = '#E8E5DE'
const ZOOM = 1.2
const MAP_TRANSITION: Transition = {duration: 0.65, ease: [0.32, 0, 0.24, 1]}

function provinceFill(p: Province, hovered: string | null, selected: string | null): string {
  if (selected === p.id || hovered === p.id) return '#FFD950'
  return 'transparent'
}

/* ─── Main page ──────────────────────────────────────────────── */

export default function ReferencesPage({locale, chantiers}: {locale: AppLocale; chantiers: Chantier[]}) {
  const copy = COPY[locale]
  const comingSoon = COMING_SOON[locale]
  if (!copy || comingSoon) return <ComingSoonPage locale={locale} cs={comingSoon!} />
  return <BelgiumPage locale={locale} chantiers={chantiers} copy={copy} />
}

/* ── Belgium full page ────────────────────────────────────────── */

function BelgiumPage({locale, chantiers, copy}: {
  locale: AppLocale
  chantiers: Chantier[]
  copy: NonNullable<(typeof COPY)[AppLocale]>
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [zooming, setZooming] = useState(false)
  const router = useRouter()

  const handleClick = useCallback(
    (province: Province) => {
      if (zooming) return
      setSelected(province.id)
      setZooming(true)
      setTimeout(() => router.push(getProvincePageUrl(locale, getProvinceSlug(province, locale))), 700)
    },
    [zooming, locale, router],
  )

  const sel = BELGIUM_PROVINCES.find((p) => p.id === selected)
  const [cx, cy] = sel?.centroid ?? [SVG_W / 2, SVG_H / 2]
  const tx = selected ? `${(0.5 - cx / SVG_W) * ZOOM * 100}%` : '0%'
  const ty = selected ? `${(0.5 - cy / SVG_H) * ZOOM * 100}%` : '0%'

  return (
    <div className="flex flex-col bg-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="h-[44vh] relative overflow-hidden" style={{backgroundColor: CLAY}}>

        {/* Map: fixed height keeps scale; negative top moves it up into the strip */}
        <div className="hidden lg:block absolute right-[18%] w-[38%]" style={{top: '-24vh', height: '72vh'}}>
          <motion.svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
            style={{transformOrigin: '50% 50%'}}
            animate={zooming && sel ? {scale: ZOOM, x: tx, y: ty} : {scale: 1, x: '0%', y: '0%'}}
            transition={MAP_TRANSITION}
          >
            {BELGIUM_PROVINCES.map((p) => (
              <path
                key={p.id}
                d={p.path}
                fill={provinceFill(p, zooming ? null : hovered, selected)}
                stroke="#B0A89E"
                strokeWidth={0.3}
                strokeLinejoin="round"
                style={{cursor: !zooming ? 'pointer' : 'default', transition: 'fill 0.15s', pointerEvents: 'all'}}
                onMouseEnter={() => !zooming && setHovered(p.id)}
                onMouseLeave={() => !zooming && setHovered(null)}
                onClick={() => !zooming && handleClick(p)}
              />
            ))}
          </motion.svg>
        </div>

        <motion.div
          className="relative h-full flex flex-col justify-center px-8 md:px-16 pointer-events-none"
          style={{zIndex: 10000}}
          animate={{opacity: zooming ? 0 : 1}}
          transition={{duration: 0.3, ease: [0.32, 0, 0.24, 1]}}
        >
          <div className="max-w-screen-2xl mx-auto w-full">
            <div className="lg:w-1/2 lg:pr-16 pointer-events-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-wdd-black leading-none mb-4">
                <span className="block">{copy.h1Line1}</span>
                <span className="block">{copy.h1Line2}</span>
                <span className="block text-wdd-mud">{copy.h1Line3}</span>
              </h1>
              <p className="text-sm font-light text-wdd-black/65 leading-relaxed">
                {copy.desc}
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {hovered && !zooming && (
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

      {/* ── PROJETS ──────────────────────────────────────────── */}
      <section className="bg-white py-24 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-0.5 bg-wdd-yellow" />
            <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">
              {copy.portfolioEyebrow}
            </span>
          </div>

          <div className="flex items-end justify-between mb-12 gap-4">
            <h2 className="text-4xl font-bold leading-tight">{copy.allProjects}</h2>
            {chantiers.length > 0 && (
              <span className="text-sm font-light text-black/40 shrink-0">
                {copy.projectCount(chantiers.length)}
              </span>
            )}
          </div>

          {chantiers.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5">
              {chantiers.map((c) => (
                <ChantierCard key={c._id} chantier={c} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
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

/* ── Coming soon page ─────────────────────────────────────────── */

function ComingSoonPage({locale, cs}: {locale: AppLocale; cs: NonNullable<(typeof COMING_SOON)[AppLocale]>}) {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      <section className="flex-1 flex flex-col justify-center px-8 md:px-16 py-32" style={{backgroundColor: CLAY}}>
        <div className="max-w-screen-2xl mx-auto w-full">
          <div className="max-w-2xl">
            <div className="w-10 h-0.5 bg-wdd-black/30 mb-8" />
            <h1 className="text-4xl md:text-5xl font-bold text-wdd-black leading-tight mb-6">
              {cs.title}
            </h1>
            <p className="text-base font-light text-wdd-black/60 leading-relaxed mb-10">
              {cs.sub}
            </p>
            <Link
              href={getLocalizedPath(locale, 'demarrer')}
              className="inline-block bg-wdd-black text-white px-8 py-4 text-sm font-bold hover:bg-wdd-mud transition-colors"
            >
              {cs.cta} →
            </Link>
          </div>
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

function EmptyState() {
  return (
    <div className="border border-dashed border-black/15 p-16 text-center">
      <div className="text-sm font-light text-black/35">
        —
      </div>
    </div>
  )
}
