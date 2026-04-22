import Link from 'next/link'
import {getLocalizedPath, type RouteKey, type AppLocale} from '@/src/i18n/routes'
import type {SitePage} from '@/src/lib/sitePage'

export default function EditorialPage({
  page,
  locale,
}: {
  page: SitePage
  locale: AppLocale
}) {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-wdd-black text-white px-8 py-20">
        <div className="max-w-screen-lg mx-auto">
          {page.heroEyebrow && (
            <div className="text-xs uppercase tracking-[0.2em] text-wdd-yellow/60 mb-4">
              {page.heroEyebrow}
            </div>
          )}
          <h1 className="text-5xl font-bold leading-tight mb-5">
            {page.heroTitle || page.title}
          </h1>
          {page.heroSubtitle && (
            <p className="text-base text-white/65 max-w-3xl leading-relaxed">
              {page.heroSubtitle}
            </p>
          )}
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="max-w-screen-lg mx-auto space-y-14">
          {(page.sections || []).map((section) => (
            <div key={section._key || section.title}>
              {section.eyebrow && (
                <div className="text-xs uppercase tracking-[0.2em] text-wdd-mud mb-3">
                  {section.eyebrow}
                </div>
              )}
              {section.title && (
                <h2 className="text-3xl font-bold leading-tight mb-4">
                  {section.title}
                </h2>
              )}
              {section.body && (
                <p className="text-base text-black/75 leading-8 whitespace-pre-line">
                  {section.body}
                </p>
              )}
              {section.items && section.items.length > 0 && (
                <ul className="mt-5 grid gap-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base text-black/75">
                      <span className="w-2 h-2 mt-2 bg-wdd-yellow flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {page.faqs && page.faqs.length > 0 && (
            <div>
              {page.faqTitle && (
                <h2 className="text-3xl font-bold mb-6">{page.faqTitle}</h2>
              )}
              <div className="grid gap-4">
                {page.faqs.map((faq) => (
                  <div key={faq._key || faq.question} className="border border-black/10 p-6">
                    {faq.question && (
                      <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                    )}
                    {faq.answer && (
                      <p className="text-sm text-black/70 leading-7 whitespace-pre-line">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(page.ctaTitle || page.ctaText) && (
            <div className="bg-wdd-yellow p-8">
              {page.ctaPretitle && (
                <div className="text-xs uppercase tracking-[0.2em] text-black/55 mb-3">
                  {page.ctaPretitle}
                </div>
              )}
              {page.ctaTitle && (
                <h2 className="text-3xl font-bold mb-4">{page.ctaTitle}</h2>
              )}
              {page.ctaText && (
                <p className="text-base text-black/75 leading-8 mb-6">{page.ctaText}</p>
              )}
              {page.ctaLabel && page.ctaRouteKey && (
                <Link
                  href={getLocalizedPath(locale, page.ctaRouteKey as RouteKey)}
                  className="inline-block bg-wdd-black text-wdd-yellow px-6 py-3 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
                >
                  {page.ctaLabel}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
