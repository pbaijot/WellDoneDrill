import Image from 'next/image'
import Link from 'next/link'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import type {AProposPageData} from '@/src/lib/aProposPage'
import type {GlobalSettingsData} from '@/src/lib/globalSettings'
import DemarrerCTA from './DemarrerCTA'
import {urlFor} from '@/src/lib/sanityImage'

function IconInnovation() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <path d="M9 18h6" /><path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  )
}
function IconDurabilite() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}
function IconCollaboration() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function IconIntegrite() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}
function IconExcellence() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}

const VALUE_ICONS = [IconInnovation, IconDurabilite, IconCollaboration, IconIntegrite, IconExcellence]

const DEFAULT_VALUES = [
  {title: 'Innovation', body: "Nous nous engageons à rester à l'avant-garde de l'innovation en matière de forage géothermique. Nous investissons dans la recherche et le développement pour exploiter de nouvelles technologies et améliorer nos processus."},
  {title: 'Durabilité', body: "Nous sommes convaincus que la géothermie est un levier puissant pour un avenir énergétique propre et durable. Chaque forage réalisé est une contribution directe à la réduction des émissions de CO₂ et à la décarbonation du bâti."},
  {title: 'Collaboration', body: "Nous croyons en la force de la collaboration. C'est en travaillant main dans la main avec nos partenaires, nos clients et employés que nous pouvons atteindre nos objectifs."},
  {title: 'Intégrité', body: "Nous agissons avec rigueur, éthique et transparence dans toutes nos missions. Nos engagements sont clairs, nos méthodes maîtrisées et notre relation client fondée sur la confiance et la responsabilité."},
  {title: 'Excellence', body: "Nous visons les plus hauts standards de qualité dans chacune de nos interventions. Notre exigence technique et notre sens du détail font de WellDoneDrill un référent dans son domaine."},
]

const DEFAULT_WHY_ITEMS = [
  {title: 'Technologies accessibles', body: "Nous proposons des technologies de forage géothermique de pointe, tout en veillant à maintenir des coûts d'utilisation maîtrisés."},
  {title: 'Expertise géologique wallonne', body: "Notre connaissance fine du sous-sol wallon et nos années d'expérience sur le terrain garantissent des forages précis, sûrs et adaptés aux spécificités locales."},
  {title: 'Acteur local & réactif', body: "Nos clients bénéficient d'un contact direct avec une équipe de proximité, investie à chaque étape du projet."},
  {title: 'Solutions flexibles', body: "Que vous soyez particulier, promoteur, entreprise, architecte ou institution publique, nous développons des solutions sur mesure."},
]

export default function AProposPage({locale, page, settings}: {locale: AppLocale; page?: AProposPageData | null; settings?: GlobalSettingsData | null}) {
  const values = page?.values?.length
    ? page.values.map(v => ({title: v.title ?? '', body: v.body ?? ''}))
    : DEFAULT_VALUES

  const whyItems = page?.whyItems?.length
    ? page.whyItems.map(v => ({title: v.title ?? '', body: v.body ?? ''}))
    : DEFAULT_WHY_ITEMS

  return (
    <div className="flex flex-col">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-[75vh] flex items-center px-8 md:px-16 overflow-hidden">
        <Image
          src={page?.heroImage ? urlFor(page.heroImage)?.url() ?? '/images/abricotiers-2.jpg' : '/images/abricotiers-2.jpg'}
          alt="WellDoneDrill forage géothermique"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wdd-black/85 via-wdd-black/55 to-transparent" />
        <div className="relative z-10 max-w-screen-2xl mx-auto w-full">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.08] mb-6">
              {page?.heroTitle ?? "Offrons une énergie propre\net durable aux générations futures"}
            </h1>
            <p className="text-base font-light text-white/70 leading-relaxed max-w-lg mb-10">
              {page?.heroSubtitle ?? "WellDoneDrill, acteur wallon du forage géothermique, façonne aujourd'hui les fondations énergétiques de demain. Spécialiste de la géothermie fermée et ouverte, notre entreprise propose des solutions durables et sur mesure pour tous types de bâtiments."}
            </p>
            <Link href={getLocalizedPath(locale, 'demarrer')} className="inline-block bg-wdd-yellow text-wdd-black px-7 py-3.5 text-sm font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors rounded-sm">
              {page?.heroCtaLabel ?? "Demandez un devis gratuit"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── MISSION ────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 pl-8 md:pl-[max(4rem,calc(50vw-48rem))] pr-8 lg:pr-20 pb-12 lg:pb-0 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6 leading-tight whitespace-pre-line">
              {page?.missionTitle ?? "Notre mission va au-delà\ndes économies d'énergie."}
            </h2>
            <p className="text-base font-light text-black/65 leading-8 mb-6">
              {page?.missionBody1 ?? "Nous contribuons à réduire l'empreinte carbone de nos territoires, en rendant la géothermie accessible à tous, pour tous types de projets, et en grande quantité."}
            </p>
            {(page?.missionBody2 ?? true) && (
              <p className="text-sm font-light text-black/55 leading-7 mb-6">
                {page?.missionBody2 ?? "Face à l'urgence climatique et à la nécessité de sortir des énergies fossiles, la géothermie s'impose comme une solution d'avenir : propre, renouvelable et stable. La Belgique accuse pourtant un retard considérable dans le développement de ces technologies. C'est dans ce contexte que WellDoneDrill est né, avec une conviction forte : rendre la géothermie accessible et performante pour répondre à une demande en pleine croissance."}
              </p>
            )}
            {(page?.missionBody3 ?? true) && (
              <p className="text-sm font-light text-black/55 leading-7">
                {page?.missionBody3 ?? "Chez WellDoneDrill, nous souhaitons devenir leader du forage géothermique en Wallonie. Cette ambition s'ancre dans une vision à long terme, celle d'un territoire plus autonome, plus propre et résolument tourné vers l'avenir énergétique."}
              </p>
            )}
          </div>
          <div className="lg:flex-1 relative overflow-hidden rounded-sm min-h-[420px]">
            <Image
              src={page?.missionImage ? urlFor(page.missionImage)?.url() ?? '/images/DSC_2263.jpg' : '/images/DSC_2263.jpg'}
              alt="WellDoneDrill chantier"
              fill
              className="object-cover object-center"
            />
            <video
              className="absolute inset-0 w-full h-full object-cover scale-125 z-10"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={page?.missionVideoUrl ?? '/videos/mrly-comp.mov'} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ── IMAGE MATRIX ───────────────────────────────────────── */}
      <section className="bg-white p-2">
        {(() => {
          const FALLBACK_GALLERY = [
            {src: '/images/wdd-forage-expert.webp', alt: 'WellDoneDrill expertise', colSpan: 2, objectPos: 'object-center'},
            {src: '/images/team.jpg', alt: 'Équipe WellDoneDrill', colSpan: 1, objectPos: 'object-top'},
            {src: '/images/clean-drill.jpg', alt: 'Foreuse WellDoneDrill', colSpan: 1, objectPos: 'object-center'},
            {src: '/images/abricotiers-2.jpg', alt: 'Chantier géothermique', colSpan: 1, objectPos: 'object-center'},
            {src: '/images/foreuse-close-up.jpg', alt: 'Détail foreuse', colSpan: 1, objectPos: 'object-center'},
            {src: '/images/foreuse-wide.jpg', alt: 'Chantier de forage géothermique', colSpan: 2, objectPos: 'object-center'},
          ]
          const hasGallery = page?.galleryImages && page.galleryImages.length > 0
          const galleryItems = hasGallery
            ? page!.galleryImages!.map((img, i) => ({
                src: urlFor(img)?.url() ?? FALLBACK_GALLERY[i % FALLBACK_GALLERY.length]?.src ?? '/images/wdd-forage-expert.webp',
                alt: `WellDoneDrill photo ${i + 1}`,
                colSpan: i === 0 || i === page!.galleryImages!.length - 1 ? 2 : 1,
                objectPos: 'object-center',
              }))
            : FALLBACK_GALLERY
          return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {galleryItems.map((item, i) => (
                <div
                  key={i}
                  className={`${item.colSpan === 2 ? 'col-span-2' : ''} min-h-[200px] lg:min-h-[300px] relative overflow-hidden rounded-sm`}
                >
                  <Image src={item.src} alt={item.alt} fill className={`object-cover ${item.objectPos}`} />
                </div>
              ))}
            </div>
          )
        })()}
      </section>

      {/* ── VALUES ─────────────────────────────────────────────── */}
      <section className="bg-wdd-clay py-24 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <h2 className="text-3xl font-bold leading-tight mb-14">
            {page?.valuesTitle ?? "Ce qui nous guide chaque jour"}
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2">
            {values.map((v, i) => {
              const iconBg = (['bg-wdd-yellow','bg-wdd-grass','bg-wdd-mud','bg-wdd-yellow','bg-wdd-grass'] as const)[i]
              const Icon = VALUE_ICONS[i] ?? VALUE_ICONS[0]
              return (
                <div key={v.title} className="grid grid-cols-[5rem_1fr] bg-white rounded-sm overflow-hidden">
                  <div className={`flex items-center justify-center self-stretch ${iconBg}`}>
                    <Icon />
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-bold mb-2">{v.title}</h3>
                    <p className="text-sm font-light text-black/60 leading-7">{v.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── WHY WDD ────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-wdd-black mb-14 leading-tight">
            {page?.whyTitle ?? "Pourquoi choisir"}{' '}
            <span className="text-wdd-mud">WellDoneDrill ?</span>
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {whyItems.map((item) => (
              <div key={item.title} className="border border-black/10 p-7 rounded-sm">
                <h3 className="text-base font-bold text-wdd-black mb-3">{item.title}</h3>
                <p className="text-sm font-light text-black/55 leading-7">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA ────────────────────────────────────────────────── */}
      <DemarrerCTA locale={locale} variant="clay" settings={settings} />

    </div>
  )
}
