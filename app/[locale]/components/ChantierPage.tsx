import Link from 'next/link'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import type {Chantier} from '@/src/lib/referencesPage'
import {chantierImageUrl, sectorLabel} from '@/src/lib/referencesPage'
import DemarrerCTA from './DemarrerCTA'

function typeLabel(type: string | undefined): string {
  if (type === 'fermee') return 'Géothermie fermée'
  if (type === 'ouverte') return 'Géothermie ouverte'
  return type ?? ''
}

export default function ChantierPage({locale, chantier}: {locale: AppLocale; chantier: Chantier}) {
  const photoUrl = chantierImageUrl(chantier.photo, 1600)

  const attrs: {label: string; value: string | undefined}[] = [
    {label: "Maître d'ouvrage", value: chantier.client},
    {label: 'Secteur', value: sectorLabel(chantier.sector)},
    {label: 'Type de forage', value: typeLabel(chantier.type)},
    {label: 'Profondeur', value: chantier.depth ? `${chantier.depth} m` : undefined},
    {label: 'Année', value: chantier.year?.toString()},
    {label: 'Province / Région', value: chantier.province},
    {label: 'Pays', value: chantier.country === 'BE' ? 'Belgique' : chantier.country === 'FR' ? 'France' : chantier.country === 'LU' ? 'Luxembourg' : chantier.country},
  ]

  return (
    <div className="flex flex-col">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-end pb-16 px-8 md:px-16 overflow-hidden">
        {photoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={photoUrl} alt={chantier.title ?? ''} className="absolute inset-0 w-full h-full object-cover object-center" />
        ) : (
          <div className="absolute inset-0 bg-wdd-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-wdd-black/85 via-wdd-black/30 to-transparent" />
        <div className="relative z-10 max-w-screen-2xl mx-auto w-full">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link href={getLocalizedPath(locale, 'references')} className="hover:text-white transition-colors">
              Références
            </Link>
            <span>/</span>
            <span className="text-white/70">{chantier.title}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.08] mb-5">
            {chantier.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            {chantier.location && (
              <span className="text-sm text-white/55">{chantier.location}</span>
            )}
            {chantier.location && chantier.year && (
              <span className="text-white/20">·</span>
            )}
            {chantier.year && (
              <span className="text-sm text-white/55">{chantier.year}</span>
            )}
            {chantier.sector && (
              <span className="text-xs font-bold uppercase tracking-wider bg-wdd-yellow text-wdd-black px-3 py-1 rounded-sm">
                {sectorLabel(chantier.sector)}
              </span>
            )}
            {chantier.type && (
              <span className="text-xs border border-white/20 text-white/55 px-3 py-1 rounded-sm">
                {typeLabel(chantier.type)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full grid lg:grid-cols-3 gap-16">

          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 leading-tight">À propos de ce projet</h2>
            {chantier.description ? (
              <p className="text-base font-light text-black/65 leading-8 whitespace-pre-line">
                {chantier.description}
              </p>
            ) : (
              <p className="text-base font-light text-black/35 italic leading-8">
                Aucune description disponible.
              </p>
            )}
          </div>

          {/* Attributes */}
          <div className="flex flex-col gap-2">
            {attrs.filter(a => a.value).map(a => (
              <div key={a.label} className="bg-wdd-clay rounded-sm px-5 py-4">
                <div className="text-[10px] font-light text-black/40 uppercase tracking-widest mb-1">{a.label}</div>
                <div className="text-sm font-bold text-wdd-black">{a.value}</div>
              </div>
            ))}
            <Link
              href={getLocalizedPath(locale, 'references')}
              className="mt-3 text-sm font-light text-black/45 border-b border-black/20 hover:text-wdd-black hover:border-wdd-black transition-colors self-start pb-0.5"
            >
              ← Toutes les références
            </Link>
          </div>
        </div>
      </section>

      {/* ── VIDEO ─────────────────────────────────────────────────── */}
      {chantier.videoUrl && (
        <section className="bg-wdd-black py-24 px-8 md:px-16">
          <div className="max-w-screen-2xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-white mb-10">Vidéo du chantier</h2>
            <div className="relative w-full aspect-video rounded-sm overflow-hidden">
              <video
                src={chantier.videoUrl}
                controls
                className="absolute inset-0 w-full h-full object-cover"
                poster={photoUrl ?? undefined}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <DemarrerCTA locale={locale} />

    </div>
  )
}
