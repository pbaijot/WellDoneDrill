'use client'

import {useRef, useState, useEffect} from 'react'
import Image from 'next/image'
import {type AppLocale, PHONE_BY_LOCALE} from '@/src/i18n/routes'

const ODOO_FORM_URL: Record<AppLocale, string> = {
  'be-fr': 'https://welldonedrill.odoo.com/formulaire',
  'be-nl': 'https://welldonedrill.odoo.com/nl/formulaire',
  'fr-fr': 'https://welldonedrill.odoo.com/formulaire',
  'lu-fr': 'https://welldonedrill.odoo.com/formulaire',
  'lu-de': 'https://welldonedrill.odoo.com/formulaire',
}

type LocaleCopy = {
  eyebrow: string
  title: string
  subtitle: string
  phone: string
  phoneLabel: string
  email: string
  emailLabel: string
  address: string
  addressLabel: string
  hoursLabel: string
  hours: string
}

const COPY: Record<AppLocale, LocaleCopy> = {
  'be-fr': {
    eyebrow: 'Nous contacter',
    title: 'Parlons de votre projet.',
    subtitle: "Étude de faisabilité gratuite, réponse sous 48h, sans engagement. Remplissez le formulaire ou contactez-nous directement.",
    phone: PHONE_BY_LOCALE['be-fr'],
    phoneLabel: 'Téléphone',
    email: 'info@welldonedrill.energy',
    emailLabel: 'Email',
    address: 'Belgique & Grand-Duché de Luxembourg',
    addressLabel: 'Zone d\'intervention',
    hoursLabel: 'Disponibilité',
    hours: 'Lun–Ven, 8h–18h',
  },
  'be-nl': {
    eyebrow: 'Contact',
    title: 'Laten we het over uw project hebben.',
    subtitle: "Gratis haalbaarheidsstudie, antwoord binnen 48u, vrijblijvend. Vul het formulier in of neem rechtstreeks contact met ons op.",
    phone: PHONE_BY_LOCALE['be-nl'],
    phoneLabel: 'Telefoon',
    email: 'info@welldonedrill.energy',
    emailLabel: 'E-mail',
    address: 'België & Groothertogdom Luxemburg',
    addressLabel: 'Werkgebied',
    hoursLabel: 'Beschikbaarheid',
    hours: 'Ma–Vr, 8u–18u',
  },
  'fr-fr': {
    eyebrow: 'Nous contacter',
    title: 'Parlons de votre projet.',
    subtitle: "Étude de faisabilité gratuite, réponse sous 48h, sans engagement. Remplissez le formulaire ou contactez-nous directement.",
    phone: PHONE_BY_LOCALE['fr-fr'],
    phoneLabel: 'Téléphone',
    email: 'info@welldonedrill.energy',
    emailLabel: 'Email',
    address: 'France du Nord & de l\'Est',
    addressLabel: 'Zone d\'intervention',
    hoursLabel: 'Disponibilité',
    hours: 'Lun–Ven, 8h–18h',
  },
  'lu-fr': {
    eyebrow: 'Nous contacter',
    title: 'Parlons de votre projet.',
    subtitle: "Étude de faisabilité gratuite, réponse sous 48h, sans engagement. Remplissez le formulaire ou contactez-nous directement.",
    phone: PHONE_BY_LOCALE['lu-fr'],
    phoneLabel: 'Téléphone',
    email: 'info@welldonedrill.energy',
    emailLabel: 'Email',
    address: 'Grand-Duché de Luxembourg & Belgique',
    addressLabel: 'Zone d\'intervention',
    hoursLabel: 'Disponibilité',
    hours: 'Lun–Ven, 8h–18h',
  },
  'lu-de': {
    eyebrow: 'Kontakt',
    title: 'Sprechen wir über Ihr Projekt.',
    subtitle: "Kostenlose Machbarkeitsstudie, Antwort innerhalb von 48 Stunden, unverbindlich. Füllen Sie das Formular aus oder kontaktieren Sie uns direkt.",
    phone: PHONE_BY_LOCALE['lu-de'],
    phoneLabel: 'Telefon',
    email: 'info@welldonedrill.energy',
    emailLabel: 'E-Mail',
    address: 'Großherzogtum Luxemburg & Belgien',
    addressLabel: 'Einsatzgebiet',
    hoursLabel: 'Erreichbarkeit',
    hours: 'Mo–Fr, 8–18 Uhr',
  },
}

export default function ContactPage({locale}: {locale: AppLocale}) {
  const c = COPY[locale]
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeHeight, setIframeHeight] = useState(700)

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== 'https://welldonedrill.odoo.com') return
      const h = typeof e.data === 'number' ? e.data : e.data?.height
      if (h && typeof h === 'number' && h > 100) setIframeHeight(h)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  return (
    <div className="flex flex-col bg-white">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative h-[40vh] overflow-hidden px-8 md:px-16">
        <Image
          src="/images/wdd-geothermie_fermee-terre.webp"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-wdd-black/65" />
        <div className="relative z-10 max-w-screen-2xl mx-auto h-full flex items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-5 h-0.5 bg-wdd-yellow" />
              <span className="text-xs font-light tracking-widest text-white/45 uppercase">{c.eyebrow}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              {c.title}
            </h1>
            <p className="text-base font-light text-white/55 leading-relaxed">
              {c.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ── INFOS + FORMULAIRE ───────────────────────────── */}
      <section className="bg-wdd-clay py-[7.5rem] px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <div className="grid lg:grid-cols-[280px_1fr] gap-16">

            {/* Left — contact details */}
            <div className="flex flex-col gap-8">
              {[
                {
                  label: c.phoneLabel,
                  value: c.phone,
                  href: `tel:${c.phone.replace(/\s/g, '')}`,
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 01.01 1.18 2 2 0 012 .01h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                    </svg>
                  ),
                },
                {
                  label: c.emailLabel,
                  value: c.email,
                  href: `mailto:${c.email}`,
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  ),
                },
                {
                  label: c.addressLabel,
                  value: c.address,
                  href: null,
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                },
                {
                  label: c.hoursLabel,
                  value: c.hours,
                  href: null,
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  ),
                },
              ].map(({label, value, href, icon}) => (
                <div key={label} className="flex gap-4 items-start">
                  <div className="w-9 h-9 bg-wdd-yellow flex items-center justify-center shrink-0 rounded-sm text-wdd-black">
                    {icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-black/40 mb-1">{label}</div>
                    {href ? (
                      <a href={href} className="text-sm font-semibold text-wdd-black hover:text-wdd-mud transition-colors">
                        {value}
                      </a>
                    ) : (
                      <div className="text-sm font-semibold text-wdd-black">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right — Odoo form */}
            <div className="bg-white rounded-sm overflow-hidden">
              <iframe
                ref={iframeRef}
                src={ODOO_FORM_URL[locale]}
                title={c.eyebrow}
                width="100%"
                scrolling="no"
                style={{height: iframeHeight, border: 'none', display: 'block', transition: 'height 0.2s ease'}}
                loading="lazy"
                allow="fullscreen"
              />
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
