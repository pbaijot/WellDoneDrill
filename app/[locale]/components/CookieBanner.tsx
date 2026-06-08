'use client'

import {useState, useEffect, useCallback} from 'react'
import Script from 'next/script'

type Consent = {analytics: boolean; advertising: boolean}

const COOKIE_NAME = 'wdd_consent'

const COPY: Record<string, {
  title: string; body: string
  acceptAll: string; rejectAll: string; customize: string; save: string
  essential: string; essentialDesc: string
  analytics: string; analyticsDesc: string
  advertising: string; advertisingDesc: string
  manage: string
}> = {
  'be-fr': {
    title: 'Nous utilisons des cookies',
    body: "Certains cookies nous aident à mesurer l'audience du site (Google Analytics) et à diffuser des publicités pertinentes (Meta, LinkedIn). Ils ne sont déposés qu'avec votre consentement.",
    acceptAll: 'Tout accepter', rejectAll: 'Tout refuser', customize: 'Personnaliser', save: 'Enregistrer mes choix',
    essential: 'Cookies essentiels', essentialDesc: 'Nécessaires au fonctionnement du site. Toujours actifs.',
    analytics: 'Cookies analytiques', analyticsDesc: 'Google Analytics 4 et Tag Manager — mesure d\'audience et amélioration du site.',
    advertising: 'Cookies publicitaires', advertisingDesc: 'Meta Pixel et LinkedIn Insight Tag — publicités personnalisées sur d\'autres plateformes.',
    manage: 'Gérer les cookies',
  },
  'be-nl': {
    title: 'Wij gebruiken cookies',
    body: 'Bepaalde cookies helpen ons het websiteverkeer te meten (Google Analytics) en relevante advertenties te tonen (Meta, LinkedIn). Ze worden alleen geplaatst met uw toestemming.',
    acceptAll: 'Alles accepteren', rejectAll: 'Alles weigeren', customize: 'Aanpassen', save: 'Mijn keuzes opslaan',
    essential: 'Essentiële cookies', essentialDesc: 'Noodzakelijk voor het functioneren van de website. Altijd actief.',
    analytics: 'Analytische cookies', analyticsDesc: 'Google Analytics 4 en Tag Manager — websitestatistieken en verbetering.',
    advertising: 'Advertentiecookies', advertisingDesc: 'Meta Pixel en LinkedIn Insight Tag — gepersonaliseerde advertenties op andere platformen.',
    manage: 'Cookies beheren',
  },
  'fr-fr': {
    title: 'Nous utilisons des cookies',
    body: "Certains cookies nous aident à mesurer l'audience du site (Google Analytics) et à diffuser des publicités pertinentes (Meta, LinkedIn). Ils ne sont déposés qu'avec votre consentement.",
    acceptAll: 'Tout accepter', rejectAll: 'Tout refuser', customize: 'Personnaliser', save: 'Enregistrer mes choix',
    essential: 'Cookies essentiels', essentialDesc: 'Nécessaires au fonctionnement du site. Toujours actifs.',
    analytics: 'Cookies analytiques', analyticsDesc: 'Google Analytics 4 et Tag Manager — mesure d\'audience et amélioration du site.',
    advertising: 'Cookies publicitaires', advertisingDesc: 'Meta Pixel et LinkedIn Insight Tag — publicités personnalisées sur d\'autres plateformes.',
    manage: 'Gérer les cookies',
  },
  'lu-fr': {
    title: 'Nous utilisons des cookies',
    body: "Certains cookies nous aident à mesurer l'audience du site (Google Analytics) et à diffuser des publicités pertinentes (Meta, LinkedIn). Ils ne sont déposés qu'avec votre consentement.",
    acceptAll: 'Tout accepter', rejectAll: 'Tout refuser', customize: 'Personnaliser', save: 'Enregistrer mes choix',
    essential: 'Cookies essentiels', essentialDesc: 'Nécessaires au fonctionnement du site. Toujours actifs.',
    analytics: 'Cookies analytiques', analyticsDesc: 'Google Analytics 4 et Tag Manager — mesure d\'audience et amélioration du site.',
    advertising: 'Cookies publicitaires', advertisingDesc: 'Meta Pixel et LinkedIn Insight Tag — publicités personnalisées sur d\'autres plateformes.',
    manage: 'Gérer les cookies',
  },
  'lu-de': {
    title: 'Wir verwenden Cookies',
    body: 'Einige Cookies helfen uns, die Website-Reichweite zu messen (Google Analytics) und relevante Werbung zu schalten (Meta, LinkedIn). Sie werden nur mit Ihrer Einwilligung gesetzt.',
    acceptAll: 'Alle akzeptieren', rejectAll: 'Alle ablehnen', customize: 'Anpassen', save: 'Meine Auswahl speichern',
    essential: 'Notwendige Cookies', essentialDesc: 'Für das Funktionieren der Website erforderlich. Immer aktiv.',
    analytics: 'Analyse-Cookies', analyticsDesc: 'Google Analytics 4 und Tag Manager — Website-Statistiken und Verbesserung.',
    advertising: 'Werbe-Cookies', advertisingDesc: 'Meta Pixel und LinkedIn Insight Tag — personalisierte Werbung auf anderen Plattformen.',
    manage: 'Cookies verwalten',
  },
  'be-en': {
    title: 'We use cookies',
    body: "Some cookies help us measure site traffic (Google Analytics) and serve relevant ads (Meta, LinkedIn). They are only set with your consent.",
    acceptAll: 'Accept all', rejectAll: 'Reject all', customize: 'Customise', save: 'Save my choices',
    essential: 'Essential cookies', essentialDesc: 'Required for the website to function. Always active.',
    analytics: 'Analytics cookies', analyticsDesc: 'Google Analytics 4 and Tag Manager — audience measurement and site improvement.',
    advertising: 'Advertising cookies', advertisingDesc: 'Meta Pixel and LinkedIn Insight Tag — personalised ads on other platforms.',
    manage: 'Manage cookies',
  },
  'fr-en': {
    title: 'We use cookies',
    body: "Some cookies help us measure site traffic (Google Analytics) and serve relevant ads (Meta, LinkedIn). They are only set with your consent.",
    acceptAll: 'Accept all', rejectAll: 'Reject all', customize: 'Customise', save: 'Save my choices',
    essential: 'Essential cookies', essentialDesc: 'Required for the website to function. Always active.',
    analytics: 'Analytics cookies', analyticsDesc: 'Google Analytics 4 and Tag Manager — audience measurement and site improvement.',
    advertising: 'Advertising cookies', advertisingDesc: 'Meta Pixel and LinkedIn Insight Tag — personalised ads on other platforms.',
    manage: 'Manage cookies',
  },
  'lu-en': {
    title: 'We use cookies',
    body: "Some cookies help us measure site traffic (Google Analytics) and serve relevant ads (Meta, LinkedIn). They are only set with your consent.",
    acceptAll: 'Accept all', rejectAll: 'Reject all', customize: 'Customise', save: 'Save my choices',
    essential: 'Essential cookies', essentialDesc: 'Required for the website to function. Always active.',
    analytics: 'Analytics cookies', analyticsDesc: 'Google Analytics 4 and Tag Manager — audience measurement and site improvement.',
    advertising: 'Advertising cookies', advertisingDesc: 'Meta Pixel and LinkedIn Insight Tag — personalised ads on other platforms.',
    manage: 'Manage cookies',
  },
}

function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  if (!m) return null
  try { return JSON.parse(decodeURIComponent(m[1])) } catch { return null }
}

function writeConsent(c: Consent) {
  const exp = new Date()
  exp.setFullYear(exp.getFullYear() + 1)
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(c))}; expires=${exp.toUTCString()}; path=/; SameSite=Lax`
}

function Toggle({on, onToggle}: {on: boolean; onToggle: () => void}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`shrink-0 relative w-10 h-5 rounded-full transition-colors duration-200 ${on ? 'bg-wdd-yellow' : 'bg-white/20'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

export default function CookieBanner({locale}: {locale: string}) {
  const [consent, setConsentState] = useState<Consent | null>(null)
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [advertising, setAdvertising] = useState(false)

  useEffect(() => {
    const saved = readConsent()
    if (saved) {
      setConsentState(saved)
    } else {
      const t = setTimeout(() => setVisible(true), 400)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    // "Gérer les cookies" button in Footer dispatches this event
    const handler = () => {
      const cur = readConsent()
      setAnalytics(cur?.analytics ?? false)
      setAdvertising(cur?.advertising ?? false)
      setExpanded(true)
      setVisible(true)
    }
    window.addEventListener('wdd:cookie-settings', handler)
    return () => window.removeEventListener('wdd:cookie-settings', handler)
  }, [])

  const apply = useCallback((c: Consent) => {
    writeConsent(c)
    setConsentState(c)
    setVisible(false)
    setExpanded(false)
  }, [])

  const c = COPY[locale] ?? COPY['be-fr']
  const GA4_ID  = process.env.NEXT_PUBLIC_GA4_ID
  const GTM_ID  = process.env.NEXT_PUBLIC_GTM_ID
  const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const LI_ID   = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID

  return (
    <>
      {/* ── Tracking scripts ── loaded only when consent is given ── */}
      {consent?.analytics && GA4_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            gtag('js',new Date());
            gtag('config','${GA4_ID}',{anonymize_ip:true});
          `}</Script>
        </>
      )}
      {consent?.analytics && GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
      )}
      {consent?.advertising && META_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
          s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
          (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${META_ID}');fbq('track','PageView');
        `}</Script>
      )}
      {consent?.advertising && LI_ID && (
        <Script id="linkedin-insight" strategy="afterInteractive">{`
          _linkedin_partner_id="${LI_ID}";
          window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          (function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};
          window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];
          var b=document.createElement("script");b.type="text/javascript";b.async=true;
          b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
          s.parentNode.insertBefore(b,s);})(window.lintrk);
        `}</Script>
      )}

      {/* ── Banner ── */}
      {visible && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[200] bg-wdd-black border-t border-white/10 shadow-[0_-4px_32px_rgba(0,0,0,0.4)]"
          role="dialog"
          aria-label={c.title}
        >
          <div className="max-w-screen-xl mx-auto px-6 py-5">

            {!expanded ? (
              /* ── Compact view ── */
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white mb-1">{c.title}</p>
                  <p className="text-xs font-light text-white/55 leading-relaxed">{c.body}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      const cur = readConsent()
                      setAnalytics(cur?.analytics ?? false)
                      setAdvertising(cur?.advertising ?? false)
                      setExpanded(true)
                    }}
                    className="text-xs font-light text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
                  >
                    {c.customize}
                  </button>
                  <button
                    onClick={() => apply({analytics: false, advertising: false})}
                    className="px-4 py-2 text-xs font-semibold text-white/70 border border-white/15 hover:border-white/40 hover:text-white transition-colors rounded-sm"
                  >
                    {c.rejectAll}
                  </button>
                  <button
                    onClick={() => apply({analytics: true, advertising: true})}
                    className="px-4 py-2 text-xs font-semibold bg-wdd-yellow text-wdd-black hover:brightness-110 transition-all rounded-sm"
                  >
                    {c.acceptAll}
                  </button>
                </div>
              </div>
            ) : (
              /* ── Expanded / customize view ── */
              <div>
                <p className="text-sm font-semibold text-white mb-4">{c.customize}</p>
                <div className="space-y-4 mb-5">
                  {/* Essential — always on */}
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs font-semibold text-white">{c.essential}</p>
                      <p className="text-xs font-light text-white/45 mt-0.5">{c.essentialDesc}</p>
                    </div>
                    <span className="shrink-0 mt-0.5 text-wdd-yellow text-xs font-semibold">✓</span>
                  </div>
                  {/* Analytics */}
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs font-semibold text-white">{c.analytics}</p>
                      <p className="text-xs font-light text-white/45 mt-0.5">{c.analyticsDesc}</p>
                    </div>
                    <Toggle on={analytics} onToggle={() => setAnalytics(v => !v)} />
                  </div>
                  {/* Advertising */}
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs font-semibold text-white">{c.advertising}</p>
                      <p className="text-xs font-light text-white/45 mt-0.5">{c.advertisingDesc}</p>
                    </div>
                    <Toggle on={advertising} onToggle={() => setAdvertising(v => !v)} />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => apply({analytics: false, advertising: false})}
                    className="text-xs font-light text-white/35 hover:text-white/60 transition-colors"
                  >
                    {c.rejectAll}
                  </button>
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => apply({analytics, advertising})}
                      className="px-5 py-2 text-xs font-semibold bg-wdd-yellow text-wdd-black hover:brightness-110 transition-all rounded-sm"
                    >
                      {c.save}
                    </button>
                    <button
                      onClick={() => apply({analytics: true, advertising: true})}
                      className="px-5 py-2 text-xs font-semibold border border-wdd-yellow/50 text-wdd-yellow hover:border-wdd-yellow transition-colors rounded-sm"
                    >
                      {c.acceptAll}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
