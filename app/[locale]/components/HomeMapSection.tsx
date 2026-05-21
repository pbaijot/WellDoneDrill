'use client'

import {useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {motion, AnimatePresence} from 'framer-motion'
import {
  BELGIUM_PROVINCES,
  getProvinceName,
  getProvincePageUrl,
  getProvinceSlug,
  chantierImageUrl,
  TYPE_LABEL,
  SECTOR_LABEL,
  localizedProvince,
  type Province,
  type Chantier,
} from '@/src/lib/referencesPage'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'

const PER_PAGE = 4

function matchesProvince(c: Chantier, p: Province): boolean {
  if (!c.province) return false
  if (c.province === p.slug) return true
  const cp = c.province.toLowerCase()
  return cp.includes(p.nameFr.toLowerCase()) || cp.includes(p.nameNl.toLowerCase())
}

export default function HomeMapSection({
  locale,
  chantiers,
}: {
  locale: AppLocale
  chantiers: Chantier[]
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hovered, setHovered]       = useState<string | null>(null)
  const [page, setPage]             = useState(0)

  const selectedProvince = selectedId
    ? BELGIUM_PROVINCES.find((p) => p.id === selectedId) ?? null
    : null

  const filtered    = selectedProvince ? chantiers.filter((c) => matchesProvince(c, selectedProvince)) : chantiers
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage    = Math.min(page, totalPages - 1)
  const displayed   = filtered.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE)

  const handleProvinceClick = (id: string) => { setSelectedId((p) => (p === id ? null : id)); setPage(0) }

  const ctaHref  = selectedProvince ? getProvincePageUrl(locale, getProvinceSlug(selectedProvince, locale)) : getLocalizedPath(locale, 'references')
  const ALL_PROJECTS: Record<string, string> = {'be-nl': 'Alle realisaties bekijken', 'lu-de': 'Alle Projekte ansehen'}
  const ALL_IN: Record<string, string>      = {'be-nl': 'Alle projecten in', 'lu-de': 'Alle Projekte in'}
  const SELECT_PROVINCE: Record<string, string> = {'be-nl': 'Selecteer een provincie', 'lu-de': 'Wählen Sie eine Provinz'}
  const ALL_PROVINCES: Record<string, string>   = {'be-nl': 'Alle provincies', 'lu-de': 'Alle Provinzen'}
  const NO_PROJECTS: Record<string, string>     = {'be-nl': 'Momenteel geen projecten in deze provincie.', 'lu-de': 'Derzeit keine Projekte in dieser Provinz.'}
  const ctaLabel = selectedProvince
    ? `${ALL_IN[locale] ?? 'Tous les projets en'} ${getProvinceName(selectedProvince, locale)}`
    : (ALL_PROJECTS[locale] ?? 'Voir toutes nos réalisations')

  return (
    <section className="bg-white min-h-[90vh] flex flex-col justify-center py-20 px-8 md:px-16">
      <div className="max-w-screen-2xl mx-auto w-full">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <h2 className="text-4xl font-bold leading-tight">
            Géothermie partout <span className="text-wdd-mud">en Belgique</span>
          </h2>
          <div className="flex items-center gap-4 shrink-0">
            {selectedProvince ? (
              <>
                <span className="text-xs font-bold text-wdd-black uppercase tracking-widest">
                  {getProvinceName(selectedProvince, locale)}
                  {filtered.length > 0 && (
                    <span className="ml-2 text-black/30 font-light normal-case tracking-normal">
                      — {filtered.length} projet{filtered.length > 1 ? 's' : ''}
                    </span>
                  )}
                </span>
                <button
                  onClick={() => { setSelectedId(null); setPage(0) }}
                  className="text-xs font-light text-black/35 hover:text-black/70 transition-colors underline underline-offset-2"
                >
                  {ALL_PROVINCES[locale] ?? 'Toutes les provinces'}
                </button>
              </>
            ) : (
              <span className="text-xs font-light text-black/30 uppercase tracking-widest">
                {chantiers.length > 0 ? `${chantiers.length} projets au total` : 'Tous les projets'}
              </span>
            )}
          </div>
        </div>

        {/* ── Main grid ─────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Map */}
          <div>
            <svg
              viewBox="55 350 940 730"
              preserveAspectRatio="xMidYMid meet"
              className="w-full"
            >
              {BELGIUM_PROVINCES.map((p) => {
                const isActive = selectedId === p.id || hovered === p.id
                return (
                  <path
                    key={p.id}
                    d={p.path}
                    fill={isActive ? '#FFD950' : 'transparent'}
                    stroke="#B0A89E"
                    strokeWidth={0.4}
                    strokeLinejoin="round"
                    style={{cursor: 'pointer', transition: 'fill 0.15s', pointerEvents: 'all'}}
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleProvinceClick(p.id)}
                  />
                )
              })}
            </svg>

            {/* Province name indicator */}
            <div className="h-5 mt-1">
              <span className="text-sm font-light text-black/40">
                {hovered
                  ? getProvinceName(BELGIUM_PROVINCES.find((p) => p.id === hovered)!, locale)
                  : selectedProvince
                    ? getProvinceName(selectedProvince, locale)
                    : (SELECT_PROVINCE[locale] ?? 'Sélectionnez une province')}
              </span>
            </div>
          </div>

          {/* Cards column */}
          <div className="flex flex-col">

            {/* Fixed-height card grid */}
            <div className="min-h-[520px] grid grid-cols-2 gap-3 content-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedId ?? '__all__'}-${safePage}`}
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  transition={{duration: 0.18}}
                  className="contents"
                >
                  {displayed.length === 0 ? (
                    <div className="col-span-2 h-[520px] flex items-center justify-center text-sm font-light text-black/35">
                      {NO_PROJECTS[locale] ?? 'Aucun projet répertorié dans cette province pour le moment.'}
                    </div>
                  ) : (
                    <>
                      {displayed.map((c) => <ProjetCard key={c._id} chantier={c} locale={locale} />)}
                      {Array.from({length: PER_PAGE - displayed.length}).map((_, i) => (
                        <div key={`ph-${i}`} className="bg-wdd-clay/30 h-[248px] rounded-sm" />
                      ))}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination + CTA */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {totalPages > 1 && Array.from({length: totalPages}).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`Page ${i + 1}`}
                    className={`transition-all duration-200 rounded-full ${
                      i === safePage ? 'w-5 h-2 bg-wdd-black' : 'w-2 h-2 bg-black/20 hover:bg-black/45'
                    }`}
                  />
                ))}
              </div>
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 text-sm font-bold text-wdd-black hover:text-wdd-mud transition-colors shrink-0"
              >
                <span>{ctaLabel}</span>
                <span className="text-wdd-yellow">→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ── Project card — clay bg, hover to black ──────────────────── */

function ProjetCard({chantier: c, locale}: {chantier: Chantier; locale: AppLocale}) {
  const imgUrl = chantierImageUrl(c.photo, 600)
  const href = c.slug ? getProvincePageUrl(locale, c.slug) : undefined

  const inner = (
    <div className="group bg-wdd-clay overflow-hidden flex flex-col h-[248px] rounded-sm">
      {imgUrl ? (
        <div className="relative h-32 overflow-hidden shrink-0">
          <Image
            src={imgUrl}
            alt={c.title ?? 'Projet WellDoneDrill'}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="h-32 bg-black/4 flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-black/8 select-none">WDD</span>
        </div>
      )}

      <div className="p-4 flex flex-col gap-2 flex-1 overflow-hidden">
        <div className="flex flex-wrap gap-1">
          {c.type && (
            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${
              c.type === 'fermee'
                ? 'bg-wdd-yellow text-wdd-black'
                : 'border border-black/20 text-black/50'
            }`}>
              {TYPE_LABEL[locale][c.type as 'fermee' | 'ouverte'] ?? c.type}
            </span>
          )}
          {c.sector && (
            <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-black/12 text-black/40">
              {SECTOR_LABEL[locale][c.sector] ?? c.sector}
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold leading-snug line-clamp-3">
          {c.title ?? 'Projet géothermique'}
        </h3>
        {(c.location || c.province) && (
          <p className="text-xs font-light text-black/40 truncate mt-auto">
            {[c.location, localizedProvince(c.province, locale)].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </div>
  )

  return href ? (
    <Link href={href} className="flex flex-col h-[248px]">{inner}</Link>
  ) : inner
}
