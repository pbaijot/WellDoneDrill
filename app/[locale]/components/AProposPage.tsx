import Image from 'next/image'
import Link from 'next/link'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import type {AProposPageData} from '@/src/lib/aProposPage'
import type {GlobalSettingsData} from '@/src/lib/globalSettings'
import DemarrerCTA from './DemarrerCTA'
import {urlFor} from '@/src/lib/sanityImage'

/* ── Icons ─────────────────────────────────────────────────────── */

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

/* ── Locale copy ────────────────────────────────────────────────── */

type LocaleCopy = {
  heroTitle: string
  heroSubtitle: string
  heroCtaLabel: string
  missionTitle: string
  missionBody1: string
  missionBody2: string
  missionBody3: string
  valuesTitle: string
  defaultValues: {title: string; body: string}[]
  whyTitle: string
  defaultWhyItems: {title: string; body: string}[]
  phone: string
  email: string
  address: string
  partnerLabel: string
}

const COPY: Record<AppLocale, LocaleCopy> = {
  'be-fr': {
    heroTitle: "Offrons une énergie propre\net durable aux générations futures",
    heroSubtitle: "WellDoneDrill, acteur wallon du forage géothermique, façonne aujourd'hui les fondations énergétiques de demain. Spécialiste de la géothermie fermée et ouverte, notre entreprise propose des solutions durables et sur mesure pour tous types de bâtiments.",
    heroCtaLabel: "Demandez un devis gratuit",
    missionTitle: "Notre mission va au-delà\ndes économies d'énergie.",
    missionBody1: "Nous contribuons à réduire l'empreinte carbone de nos territoires, en rendant la géothermie accessible à tous, pour tous types de projets, et en grande quantité.",
    missionBody2: "Face à l'urgence climatique et à la nécessité de sortir des énergies fossiles, la géothermie s'impose comme une solution d'avenir : propre, renouvelable et stable. La Belgique accuse pourtant un retard considérable dans le développement de ces technologies. C'est dans ce contexte que WellDoneDrill est né, avec une conviction forte : rendre la géothermie accessible et performante pour répondre à une demande en pleine croissance.",
    missionBody3: "Chez WellDoneDrill, nous souhaitons devenir leader du forage géothermique en Wallonie. Cette ambition s'ancre dans une vision à long terme, celle d'un territoire plus autonome, plus propre et résolument tourné vers l'avenir énergétique.",
    valuesTitle: "Ce qui nous guide chaque jour",
    defaultValues: [
      {title: 'Innovation', body: "Nous nous engageons à rester à l'avant-garde de l'innovation en matière de forage géothermique. Nous investissons dans la recherche et le développement pour exploiter de nouvelles technologies et améliorer nos processus."},
      {title: 'Durabilité', body: "Nous sommes convaincus que la géothermie est un levier puissant pour un avenir énergétique propre et durable. Chaque forage réalisé est une contribution directe à la réduction des émissions de CO₂ et à la décarbonation du bâti."},
      {title: 'Collaboration', body: "Nous croyons en la force de la collaboration. C'est en travaillant main dans la main avec nos partenaires, nos clients et employés que nous pouvons atteindre nos objectifs."},
      {title: 'Intégrité', body: "Nous agissons avec rigueur, éthique et transparence dans toutes nos missions. Nos engagements sont clairs, nos méthodes maîtrisées et notre relation client fondée sur la confiance et la responsabilité."},
      {title: 'Excellence', body: "Nous visons les plus hauts standards de qualité dans chacune de nos interventions. Notre exigence technique et notre sens du détail font de WellDoneDrill un référent dans son domaine."},
    ],
    whyTitle: "Pourquoi choisir",
    defaultWhyItems: [
      {title: 'Technologies accessibles', body: "Nous proposons des technologies de forage géothermique de pointe, tout en veillant à maintenir des coûts d'utilisation maîtrisés."},
      {title: 'Expertise géologique wallonne', body: "Notre connaissance fine du sous-sol wallon et nos années d'expérience sur le terrain garantissent des forages précis, sûrs et adaptés aux spécificités locales."},
      {title: 'Acteur local & réactif', body: "Nos clients bénéficient d'un contact direct avec une équipe de proximité, investie à chaque étape du projet."},
      {title: 'Solutions flexibles', body: "Que vous soyez particulier, promoteur, entreprise, architecte ou institution publique, nous développons des solutions sur mesure."},
    ],
    phone: 'Téléphone',
    email: 'Email',
    address: 'Adresse',
    partnerLabel: 'Partenaire',
  },

  'be-nl': {
    heroTitle: "Schone en duurzame energie\nvoor toekomstige generaties",
    heroSubtitle: "WellDoneDrill, een Waalse speler in geothermisch boren, legt vandaag de energiefundamenten van morgen. Als specialist in gesloten en open geothermie biedt ons bedrijf duurzame en op maat gemaakte oplossingen voor alle soorten gebouwen.",
    heroCtaLabel: "Vraag een gratis offerte aan",
    missionTitle: "Onze missie gaat verder\ndan energiebesparing.",
    missionBody1: "We dragen bij aan de vermindering van de koolstofvoetafdruk van onze regio's door geothermie voor iedereen toegankelijk te maken, voor alle soorten projecten en op grote schaal.",
    missionBody2: "Geconfronteerd met de klimaatcrisis en de noodzaak om fossiele brandstoffen te verlaten, profileert geothermie zich als toekomstoplossing: schoon, hernieuwbaar en stabiel. België loopt echter aanzienlijk achter in de ontwikkeling van deze technologieën. In deze context is WellDoneDrill geboren, met een sterke overtuiging: geothermie toegankelijk en performant maken om aan een groeiende vraag te voldoen.",
    missionBody3: "Bij WellDoneDrill streven we ernaar marktleider te worden in geothermisch boren in Wallonië. Deze ambitie is verankerd in een langetermijnvisie van een meer autonoom en schoner grondgebied dat resoluut op de energietoekomst is gericht.",
    valuesTitle: "Wat ons elke dag leidt",
    defaultValues: [
      {title: 'Innovatie', body: "We engageren ons om aan de voorhoede te blijven van innovatie in geothermisch boren. We investeren in onderzoek en ontwikkeling om nieuwe technologieën te benutten en onze processen te verbeteren."},
      {title: 'Duurzaamheid', body: "We zijn ervan overtuigd dat geothermie een krachtige hefboom is voor een schone en duurzame energietoekomst. Elke boring is een directe bijdrage aan de vermindering van CO₂-uitstoot en de decarbonisatie van gebouwen."},
      {title: 'Samenwerking', body: "We geloven in de kracht van samenwerking. Door hand in hand te werken met onze partners, klanten en medewerkers kunnen we onze doelstellingen bereiken."},
      {title: 'Integriteit', body: "We handelen met strengheid, ethiek en transparantie in al onze opdrachten. Onze engagementen zijn duidelijk, onze methoden beheerst en onze klantrelatie gebaseerd op vertrouwen en verantwoordelijkheid."},
      {title: 'Uitmuntendheid', body: "We streven naar de hoogste kwaliteitsstandaarden bij elk van onze interventies. Onze technische veeleisendheid en oog voor detail maken WellDoneDrill tot een referentie in het vakgebied."},
    ],
    whyTitle: "Waarom kiezen voor",
    defaultWhyItems: [
      {title: 'Toegankelijke technologie', body: "We bieden geavanceerde geothermische boortechnologieën aan, terwijl we de gebruikskosten beheersbaar houden."},
      {title: 'Waalse geologische expertise', body: "Onze grondige kennis van de Waalse ondergrond en onze jarenlange veldervaring garanderen nauwkeurige, veilige borings die zijn afgestemd op de lokale specifieke kenmerken."},
      {title: 'Lokale & reactieve speler', body: "Onze klanten profiteren van direct contact met een nabijheidsteam dat betrokken is bij elke fase van het project."},
      {title: 'Flexibele oplossingen', body: "Of u nu een particulier, promotor, bedrijf, architect of publieke instelling bent, we ontwikkelen oplossingen op maat."},
    ],
    phone: 'Telefoon',
    email: 'E-mail',
    address: 'Adres',
    partnerLabel: 'Partner',
  },

  'fr-fr': {
    heroTitle: "Offrons une énergie propre\net durable aux générations futures",
    heroSubtitle: "WellDoneDrill, spécialiste du forage géothermique, façonne aujourd'hui les fondations énergétiques de demain. Expert en géothermie fermée et ouverte, nous proposons des solutions durables et sur mesure pour tous types de bâtiments.",
    heroCtaLabel: "Demandez un devis gratuit",
    missionTitle: "Notre mission va au-delà\ndes économies d'énergie.",
    missionBody1: "Nous contribuons à réduire l'empreinte carbone des territoires, en rendant la géothermie accessible à tous, pour tous types de projets, et en grande quantité.",
    missionBody2: "Face à l'urgence climatique et à la nécessité de sortir des énergies fossiles, la géothermie s'impose comme une solution d'avenir : propre, renouvelable et stable. La France dispose d'un fort potentiel encore sous-exploité. WellDoneDrill intervient avec une conviction forte : rendre la géothermie accessible et performante pour répondre à une demande en pleine croissance.",
    missionBody3: "Chez WellDoneDrill, nous visons l'excellence du forage géothermique sur l'ensemble du territoire. Cette ambition s'ancre dans une vision à long terme, celle d'un pays plus autonome, plus propre et résolument tourné vers l'avenir énergétique.",
    valuesTitle: "Ce qui nous guide chaque jour",
    defaultValues: [
      {title: 'Innovation', body: "Nous nous engageons à rester à l'avant-garde de l'innovation en matière de forage géothermique. Nous investissons dans la recherche et le développement pour exploiter de nouvelles technologies et améliorer nos processus."},
      {title: 'Durabilité', body: "Nous sommes convaincus que la géothermie est un levier puissant pour un avenir énergétique propre et durable. Chaque forage réalisé est une contribution directe à la réduction des émissions de CO₂ et à la décarbonation du bâti."},
      {title: 'Collaboration', body: "Nous croyons en la force de la collaboration. C'est en travaillant main dans la main avec nos partenaires, nos clients et employés que nous pouvons atteindre nos objectifs."},
      {title: 'Intégrité', body: "Nous agissons avec rigueur, éthique et transparence dans toutes nos missions. Nos engagements sont clairs, nos méthodes maîtrisées et notre relation client fondée sur la confiance et la responsabilité."},
      {title: 'Excellence', body: "Nous visons les plus hauts standards de qualité dans chacune de nos interventions. Notre exigence technique et notre sens du détail font de WellDoneDrill un référent dans son domaine."},
    ],
    whyTitle: "Pourquoi choisir",
    defaultWhyItems: [
      {title: 'Technologies accessibles', body: "Nous proposons des technologies de forage géothermique de pointe, tout en veillant à maintenir des coûts d'utilisation maîtrisés."},
      {title: 'Expertise géologique locale', body: "Notre connaissance fine du sous-sol et nos années d'expérience sur le terrain garantissent des forages précis, sûrs et adaptés aux spécificités locales."},
      {title: 'Acteur local & réactif', body: "Nos clients bénéficient d'un contact direct avec une équipe de proximité, investie à chaque étape du projet."},
      {title: 'Solutions flexibles', body: "Que vous soyez particulier, promoteur, entreprise, architecte ou institution publique, nous développons des solutions sur mesure."},
    ],
    phone: 'Téléphone',
    email: 'Email',
    address: 'Adresse',
    partnerLabel: 'Partenaire',
  },

  'lu-fr': {
    heroTitle: "Offrons une énergie propre\net durable aux générations futures",
    heroSubtitle: "WellDoneDrill, spécialiste du forage géothermique, façonne aujourd'hui les fondations énergétiques de demain. Expert en géothermie fermée et ouverte, nous proposons des solutions durables et sur mesure pour tous types de bâtiments au Luxembourg et dans la Grande Région.",
    heroCtaLabel: "Demandez un devis gratuit",
    missionTitle: "Notre mission va au-delà\ndes économies d'énergie.",
    missionBody1: "Nous contribuons à réduire l'empreinte carbone du Luxembourg et de la Grande Région, en rendant la géothermie accessible à tous, pour tous types de projets, et en grande quantité.",
    missionBody2: "Face à l'urgence climatique et à la nécessité de sortir des énergies fossiles, la géothermie s'impose comme une solution d'avenir : propre, renouvelable et stable. Le Luxembourg, avec ses objectifs ambitieux de transition énergétique, constitue un terrain idéal pour le déploiement de ces technologies. WellDoneDrill y intervient avec une conviction forte : rendre la géothermie accessible et performante pour tous.",
    missionBody3: "Chez WellDoneDrill, nous visons l'excellence du forage géothermique au Luxembourg et dans la Grande Région. Cette ambition s'ancre dans une vision à long terme, celle d'un territoire plus autonome, plus propre et résolument tourné vers l'avenir énergétique.",
    valuesTitle: "Ce qui nous guide chaque jour",
    defaultValues: [
      {title: 'Innovation', body: "Nous nous engageons à rester à l'avant-garde de l'innovation en matière de forage géothermique. Nous investissons dans la recherche et le développement pour exploiter de nouvelles technologies et améliorer nos processus."},
      {title: 'Durabilité', body: "Nous sommes convaincus que la géothermie est un levier puissant pour un avenir énergétique propre et durable. Chaque forage réalisé est une contribution directe à la réduction des émissions de CO₂ et à la décarbonation du bâti."},
      {title: 'Collaboration', body: "Nous croyons en la force de la collaboration. C'est en travaillant main dans la main avec nos partenaires, nos clients et employés que nous pouvons atteindre nos objectifs."},
      {title: 'Intégrité', body: "Nous agissons avec rigueur, éthique et transparence dans toutes nos missions. Nos engagements sont clairs, nos méthodes maîtrisées et notre relation client fondée sur la confiance et la responsabilité."},
      {title: 'Excellence', body: "Nous visons les plus hauts standards de qualité dans chacune de nos interventions. Notre exigence technique et notre sens du détail font de WellDoneDrill un référent dans son domaine."},
    ],
    whyTitle: "Pourquoi choisir",
    defaultWhyItems: [
      {title: 'Technologies accessibles', body: "Nous proposons des technologies de forage géothermique de pointe, tout en veillant à maintenir des coûts d'utilisation maîtrisés."},
      {title: 'Expertise géologique locale', body: "Notre connaissance fine du sous-sol luxembourgeois et nos années d'expérience sur le terrain garantissent des forages précis, sûrs et adaptés aux spécificités locales."},
      {title: 'Acteur local & réactif', body: "Nos clients bénéficient d'un contact direct avec une équipe de proximité, investie à chaque étape du projet."},
      {title: 'Solutions flexibles', body: "Que vous soyez particulier, promoteur, entreprise, architecte ou institution publique, nous développons des solutions sur mesure."},
    ],
    phone: 'Téléphone',
    email: 'Email',
    address: 'Adresse',
    partnerLabel: 'Partenaire',
  },

  'lu-de': {
    heroTitle: "Saubere und nachhaltige Energie\nfür künftige Generationen",
    heroSubtitle: "WellDoneDrill, Spezialist für Geothermie-Bohrungen, legt heute die energetischen Grundlagen von morgen. Als Experte für geschlossene und offene Geothermie bieten wir nachhaltige und maßgeschneiderte Lösungen für alle Gebäudetypen in Luxemburg und der Großregion.",
    heroCtaLabel: "Kostenloses Angebot anfordern",
    missionTitle: "Unsere Mission geht über\nEnergieeinsparungen hinaus.",
    missionBody1: "Wir tragen zur Reduzierung des CO₂-Fußabdrucks von Luxemburg und der Großregion bei, indem wir Geothermie für alle zugänglich machen, für alle Projektarten und in großem Umfang.",
    missionBody2: "Angesichts der Klimakrise und der Notwendigkeit, aus fossilen Brennstoffen auszusteigen, etabliert sich die Geothermie als Zukunftslösung: sauber, erneuerbar und stabil. Luxemburg, mit seinen ehrgeizigen Energiewendezielen, bietet ideale Bedingungen für den Einsatz dieser Technologien. WellDoneDrill handelt mit einer starken Überzeugung: Geothermie für alle zugänglich und leistungsfähig zu machen.",
    missionBody3: "Bei WellDoneDrill streben wir nach Exzellenz bei Geothermie-Bohrungen in Luxemburg und der Großregion. Dieser Ehrgeiz ist in einer langfristigen Vision verankert: eine autonomere und sauberere Region, die entschlossen auf die Energiezukunft ausgerichtet ist.",
    valuesTitle: "Was uns jeden Tag leitet",
    defaultValues: [
      {title: 'Innovation', body: "Wir verpflichten uns, an der Spitze der Innovation im Bereich Geothermie-Bohrungen zu bleiben. Wir investieren in Forschung und Entwicklung, um neue Technologien zu nutzen und unsere Prozesse zu verbessern."},
      {title: 'Nachhaltigkeit', body: "Wir sind überzeugt, dass Geothermie ein wirksames Mittel für eine saubere und nachhaltige Energiezukunft ist. Jede durchgeführte Bohrung ist ein direkter Beitrag zur CO₂-Reduzierung und zur Dekarbonisierung von Gebäuden."},
      {title: 'Zusammenarbeit', body: "Wir glauben an die Kraft der Zusammenarbeit. Indem wir Hand in Hand mit unseren Partnern, Kunden und Mitarbeitern arbeiten, können wir unsere Ziele erreichen."},
      {title: 'Integrität', body: "Wir handeln mit Sorgfalt, Ethik und Transparenz in allen unseren Aufträgen. Unsere Verpflichtungen sind klar, unsere Methoden erprobt und unsere Kundenbeziehung auf Vertrauen und Verantwortung aufgebaut."},
      {title: 'Exzellenz', body: "Wir streben bei jedem unserer Einsätze nach höchsten Qualitätsstandards. Unser technischer Anspruch und unser Sinn für Details machen WellDoneDrill zu einer Referenz in seinem Bereich."},
    ],
    whyTitle: "Warum WellDoneDrill",
    defaultWhyItems: [
      {title: 'Zugängliche Technologien', body: "Wir bieten modernste Geothermie-Bohrtechnologien an und achten dabei auf beherrschbare Betriebskosten."},
      {title: 'Lokale geologische Expertise', body: "Unsere fundierte Kenntnis des luxemburgischen Untergrunds und unsere jahrelange Felderfahrung garantieren präzise, sichere und an lokale Besonderheiten angepasste Bohrungen."},
      {title: 'Lokaler & reaktionsschneller Akteur', body: "Unsere Kunden profitieren von direktem Kontakt mit einem nahegelegenen Team, das in jeder Projektphase engagiert ist."},
      {title: 'Flexible Lösungen', body: "Ob Privatperson, Bauträger, Unternehmen, Architekt oder öffentliche Einrichtung – wir entwickeln maßgeschneiderte Lösungen."},
    ],
    phone: 'Telefon',
    email: 'E-Mail',
    address: 'Adresse',
    partnerLabel: 'Partner',
  },
}

/* ── Component ──────────────────────────────────────────────────── */

export default function AProposPage({locale, page, settings}: {locale: AppLocale; page?: AProposPageData | null; settings?: GlobalSettingsData | null}) {
  const copy = COPY[locale] ?? COPY['be-fr']

  const values = page?.values?.length
    ? page.values.map(v => ({title: v.title ?? '', body: v.body ?? ''}))
    : copy.defaultValues

  const whyItems = page?.whyItems?.length
    ? page.whyItems.map(v => ({title: v.title ?? '', body: v.body ?? ''}))
    : copy.defaultWhyItems

  const heroImageUrl = page?.heroImage ? urlFor(page.heroImage)?.width(1920).url() ?? '/images/abricotiers-2.jpg' : '/images/abricotiers-2.jpg'
  const missionImageUrl = page?.missionImage ? urlFor(page.missionImage)?.width(1200).url() ?? '/images/DSC_2263.jpg' : '/images/DSC_2263.jpg'
  const missionVideoUrl = page?.missionVideo?.asset?.url ?? null

  const hasPartnership = !!(page?.partnershipTitle || page?.partnershipBody || page?.partnerLogos?.length)
  const hasContact = !!(page?.phone || page?.email || page?.address)

  return (
    <div className="flex flex-col">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-[75vh] flex items-center px-8 md:px-16 overflow-hidden">
        <Image
          src={heroImageUrl}
          alt="WellDoneDrill"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wdd-black/85 via-wdd-black/55 to-transparent" />
        <div className="relative z-10 max-w-screen-2xl mx-auto w-full">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.08] mb-6 whitespace-pre-line">
              {page?.heroTitle ?? copy.heroTitle}
            </h1>
            <p className="text-base font-light text-white/70 leading-relaxed max-w-lg mb-10">
              {page?.heroSubtitle ?? copy.heroSubtitle}
            </p>
            <Link href={getLocalizedPath(locale, 'demarrer')} className="inline-block bg-wdd-yellow text-wdd-black px-7 py-3.5 text-sm font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors rounded-sm">
              {page?.heroCtaLabel ?? copy.heroCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* ── MISSION ────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 pl-8 md:pl-[max(4rem,calc(50vw-48rem))] pr-8 lg:pr-20 pb-12 lg:pb-0 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6 leading-tight whitespace-pre-line">
              {page?.missionTitle ?? copy.missionTitle}
            </h2>
            <p className="text-base font-light text-black/65 leading-8 mb-6">
              {page?.missionBody1 ?? copy.missionBody1}
            </p>
            {(page?.missionBody2 ?? true) && (
              <p className="text-sm font-light text-black/55 leading-7 mb-6">
                {page?.missionBody2 ?? copy.missionBody2}
              </p>
            )}
            {(page?.missionBody3 ?? true) && (
              <p className="text-sm font-light text-black/55 leading-7">
                {page?.missionBody3 ?? copy.missionBody3}
              </p>
            )}
          </div>
          <div className="lg:flex-1 relative overflow-hidden rounded-sm min-h-[420px]">
            <Image
              src={missionImageUrl}
              alt="WellDoneDrill"
              fill
              className="object-cover object-center"
            />
            {missionVideoUrl && (
              <video
                className="absolute inset-0 w-full h-full object-cover scale-125 z-10"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src={missionVideoUrl} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </section>

      {/* ── IMAGE MATRIX ───────────────────────────────────────── */}
      {(() => {
        const FALLBACK_GALLERY = [
          {src: '/images/wdd-forage-expert.webp', alt: 'WellDoneDrill', colSpan: 2, objectPos: 'object-center'},
          {src: '/images/team.jpg', alt: 'WellDoneDrill', colSpan: 1, objectPos: 'object-top'},
          {src: '/images/clean-drill.jpg', alt: 'WellDoneDrill', colSpan: 1, objectPos: 'object-center'},
          {src: '/images/abricotiers-2.jpg', alt: 'WellDoneDrill', colSpan: 1, objectPos: 'object-center'},
          {src: '/images/foreuse-close-up.jpg', alt: 'WellDoneDrill', colSpan: 1, objectPos: 'object-center'},
          {src: '/images/foreuse-wide.jpg', alt: 'WellDoneDrill', colSpan: 2, objectPos: 'object-center'},
        ]
        const hasGallery = page?.galleryImages && page.galleryImages.length > 0
        const galleryItems = hasGallery
          ? page!.galleryImages!.map((img, i) => ({
              src: urlFor(img)?.width(1200).url() ?? FALLBACK_GALLERY[i % FALLBACK_GALLERY.length]?.src ?? '/images/wdd-forage-expert.webp',
              alt: img.alt ?? 'WellDoneDrill',
              colSpan: i === 0 || i === page!.galleryImages!.length - 1 ? 2 : 1,
              objectPos: 'object-center',
            }))
          : FALLBACK_GALLERY
        return (
          <section className="bg-white p-2">
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
          </section>
        )
      })()}

      {/* ── VALUES ─────────────────────────────────────────────── */}
      <section className="bg-wdd-clay py-24 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <h2 className="text-3xl font-bold leading-tight mb-14">
            {page?.valuesTitle ?? copy.valuesTitle}
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
            {page?.whyTitle ?? copy.whyTitle}{' '}
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

      {/* ── PARTNERSHIP ────────────────────────────────────────── */}
      {hasPartnership && (
        <section className="bg-wdd-clay py-24 px-8 md:px-16">
          <div className="max-w-screen-2xl mx-auto w-full">
            {page?.partnershipTitle && (
              <h2 className="text-3xl font-bold text-wdd-black mb-6 leading-tight">
                {page.partnershipTitle}
              </h2>
            )}
            {page?.partnershipBody && (
              <p className="text-base font-light text-black/65 leading-8 max-w-3xl mb-12">
                {page.partnershipBody}
              </p>
            )}

            {page?.partnerLogos && page.partnerLogos.length > 0 && (
              <div className="flex flex-wrap items-center gap-8 mb-12">
                {page.partnerLogos.map((logo, i) => {
                  const imgUrl = urlFor(logo)?.height(60).url()
                  if (!imgUrl) return null
                  const inner = (
                    <Image
                      key={i}
                      src={imgUrl}
                      alt={logo.alt ?? `${copy.partnerLabel} ${i + 1}`}
                      width={160}
                      height={60}
                      className="object-contain grayscale hover:grayscale-0 transition-all duration-300 max-h-[60px] w-auto"
                    />
                  )
                  return logo.url ? (
                    <a key={i} href={logo.url} target="_blank" rel="noopener noreferrer">
                      {inner}
                    </a>
                  ) : inner
                })}
              </div>
            )}

            {(page?.partnershipCta1 || page?.partnershipCta2) && (
              <div className="flex flex-wrap gap-4">
                {page?.partnershipCta1 && (
                  <Link
                    href={getLocalizedPath(locale, 'demarrer')}
                    className="inline-block bg-wdd-black text-white px-7 py-3.5 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
                  >
                    {page.partnershipCta1}
                  </Link>
                )}
                {page?.partnershipCta2 && (
                  <Link
                    href={getLocalizedPath(locale, 'demarrer')}
                    className="inline-block bg-transparent text-wdd-black px-7 py-3.5 text-sm font-bold border-2 border-wdd-black/30 hover:border-wdd-black transition-colors"
                  >
                    {page.partnershipCta2}
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CONTACT ────────────────────────────────────────────── */}
      {hasContact && (
        <section className="bg-wdd-black py-24 px-8 md:px-16">
          <div className="max-w-screen-2xl mx-auto w-full grid md:grid-cols-3 gap-8">
            {page?.phone && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">{copy.phone}</div>
                <a href={`tel:${page.phone}`} className="text-xl font-bold text-white hover:text-wdd-yellow transition-colors">
                  {page.phone}
                </a>
              </div>
            )}
            {page?.email && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">{copy.email}</div>
                <a href={`mailto:${page.email}`} className="text-xl font-bold text-white hover:text-wdd-yellow transition-colors">
                  {page.email}
                </a>
              </div>
            )}
            {page?.address && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">{copy.address}</div>
                <p className="text-xl font-bold text-white whitespace-pre-line">{page.address}</p>
              </div>
            )}
          </div>
          {page?.contactCtaLabel && (
            <div className="max-w-screen-2xl mx-auto w-full mt-12">
              <Link
                href={getLocalizedPath(locale, 'demarrer')}
                className="inline-block bg-wdd-yellow text-wdd-black px-7 py-3.5 text-sm font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors"
              >
                {page.contactCtaLabel}
              </Link>
            </div>
          )}
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────── */}
      <DemarrerCTA locale={locale} variant="clay" settings={settings} />

    </div>
  )
}
