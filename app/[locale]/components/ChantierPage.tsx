import Link from 'next/link'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import type {Chantier} from '@/src/lib/referencesPage'
import {chantierImageUrl, TYPE_LABEL, SECTOR_LABEL, DEPTH_LABEL, localizedProvince} from '@/src/lib/referencesPage'
import DemarrerCTA from './DemarrerCTA'

const LABELS: Record<AppLocale, {
  client: string; sector: string; type: string; depth: string; year: string;
  province: string; country: string; about: string; noDesc: string;
  video: string; backLink: string; references: string;
  geo_fermee: string; geo_ouverte: string;
  BE: string; FR: string; LU: string;
}> = {
  'be-fr': {
    client: "Maître d'ouvrage", sector: 'Secteur', type: 'Type de forage',
    depth: 'Profondeur', year: 'Année', province: 'Province / Région', country: 'Pays',
    about: 'À propos de ce projet', noDesc: 'Aucune description disponible.',
    video: 'Vidéo du chantier', backLink: '← Toutes les références', references: 'Références',
    geo_fermee: 'Géothermie fermée', geo_ouverte: 'Géothermie ouverte',
    BE: 'Belgique', FR: 'France', LU: 'Luxembourg',
  },
  'be-nl': {
    client: 'Opdrachtgever', sector: 'Sector', type: 'Soort boring',
    depth: 'Diepte', year: 'Jaar', province: 'Provincie / Regio', country: 'Land',
    about: 'Over dit project', noDesc: 'Geen beschrijving beschikbaar.',
    video: 'Video van de werf', backLink: '← Alle realisaties', references: 'Realisaties',
    geo_fermee: 'Gesloten geothermie', geo_ouverte: 'Open geothermie',
    BE: 'België', FR: 'Frankrijk', LU: 'Luxemburg',
  },
  'fr-fr': {
    client: "Maître d'ouvrage", sector: 'Secteur', type: 'Type de forage',
    depth: 'Profondeur', year: 'Année', province: 'Région', country: 'Pays',
    about: 'À propos de ce projet', noDesc: 'Aucune description disponible.',
    video: 'Vidéo du chantier', backLink: '← Toutes les références', references: 'Références',
    geo_fermee: 'Géothermie fermée', geo_ouverte: 'Géothermie ouverte',
    BE: 'Belgique', FR: 'France', LU: 'Luxembourg',
  },
  'lu-fr': {
    client: "Maître d'ouvrage", sector: 'Secteur', type: 'Type de forage',
    depth: 'Profondeur', year: 'Année', province: 'Région', country: 'Pays',
    about: 'À propos de ce projet', noDesc: 'Aucune description disponible.',
    video: 'Vidéo du chantier', backLink: '← Toutes les références', references: 'Références',
    geo_fermee: 'Géothermie fermée', geo_ouverte: 'Géothermie ouverte',
    BE: 'Belgique', FR: 'France', LU: 'Luxembourg',
  },
  'lu-de': {
    client: 'Auftraggeber', sector: 'Sektor', type: 'Bohrungstyp',
    depth: 'Tiefe', year: 'Jahr', province: 'Region', country: 'Land',
    about: 'Über dieses Projekt', noDesc: 'Keine Beschreibung verfügbar.',
    video: 'Video der Baustelle', backLink: '← Alle Projekte', references: 'Referenzen',
    geo_fermee: 'Geschlossene Geothermie', geo_ouverte: 'Offene Geothermie',
    BE: 'Belgien', FR: 'Frankreich', LU: 'Luxemburg',
  },
  'be-en': {
    client: 'Client', sector: 'Sector', type: 'Drilling type',
    depth: 'Depth', year: 'Year', province: 'Province / Region', country: 'Country',
    about: 'About this project', noDesc: 'No description available.',
    video: 'Project video', backLink: '← All projects', references: 'Projects',
    geo_fermee: 'Closed-loop geothermal', geo_ouverte: 'Open-loop geothermal',
    BE: 'Belgium', FR: 'France', LU: 'Luxembourg',
  },
  'fr-en': {
    client: 'Client', sector: 'Sector', type: 'Drilling type',
    depth: 'Depth', year: 'Year', province: 'Region', country: 'Country',
    about: 'About this project', noDesc: 'No description available.',
    video: 'Project video', backLink: '← All projects', references: 'Projects',
    geo_fermee: 'Closed-loop geothermal', geo_ouverte: 'Open-loop geothermal',
    BE: 'Belgium', FR: 'France', LU: 'Luxembourg',
  },
  'lu-en': {
    client: 'Client', sector: 'Sector', type: 'Drilling type',
    depth: 'Depth', year: 'Year', province: 'Region', country: 'Country',
    about: 'About this project', noDesc: 'No description available.',
    video: 'Project video', backLink: '← All projects', references: 'Projects',
    geo_fermee: 'Closed-loop geothermal', geo_ouverte: 'Open-loop geothermal',
    BE: 'Belgium', FR: 'France', LU: 'Luxembourg',
  },
}

export default function ChantierPage({locale, chantier}: {locale: AppLocale; chantier: Chantier}) {
  const photoUrl = chantierImageUrl(chantier.photo, 1600)
  const l = LABELS[locale]

  const countryLabel = chantier.country === 'BE' ? l.BE : chantier.country === 'FR' ? l.FR : chantier.country === 'LU' ? l.LU : chantier.country
  const typeFullLabel = chantier.type === 'fermee' ? l.geo_fermee : chantier.type === 'ouverte' ? l.geo_ouverte : chantier.type

  const attrs: {label: string; value: string | undefined}[] = [
    {label: l.client,   value: chantier.client},
    {label: l.sector,   value: chantier.sector ? (SECTOR_LABEL[locale][chantier.sector] ?? chantier.sector) : undefined},
    {label: l.type,     value: typeFullLabel},
    {label: l.depth,    value: chantier.depth ? `${chantier.depth} m` : undefined},
    {label: l.year,     value: chantier.year?.toString()},
    {label: l.province, value: localizedProvince(chantier.province, locale) ?? chantier.province},
    {label: l.country,  value: countryLabel},
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
              {l.references}
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
                {SECTOR_LABEL[locale][chantier.sector] ?? chantier.sector}
              </span>
            )}
            {chantier.type && (
              <span className="text-xs border border-white/20 text-white/55 px-3 py-1 rounded-sm">
                {TYPE_LABEL[locale][chantier.type as 'fermee' | 'ouverte'] ?? chantier.type}
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
            <h2 className="text-2xl font-bold mb-6 leading-tight">{l.about}</h2>
            {chantier.description ? (
              <p className="text-base font-light text-black/65 leading-8 whitespace-pre-line">
                {chantier.description}
              </p>
            ) : (
              <p className="text-base font-light text-black/35 italic leading-8">
                {l.noDesc}
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
              {l.backLink}
            </Link>
          </div>
        </div>
      </section>

      {/* ── VIDEO ─────────────────────────────────────────────────── */}
      {chantier.videoUrl && (
        <section className="bg-wdd-black py-24 px-8 md:px-16">
          <div className="max-w-screen-2xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-white mb-10">{l.video}</h2>
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
      <DemarrerCTA locale={locale} variant="clay" />

    </div>
  )
}
