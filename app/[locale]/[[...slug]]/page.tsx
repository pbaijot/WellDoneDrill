import { notFound } from 'next/navigation'
import { findRouteKeyBySlug, type AppLocale } from '@/src/i18n/routes'

type PageProps = {
  params: Promise<{
    locale: AppLocale
    slug?: string[]
  }>
}

export default async function LocalizedCatchAllPage({ params }: PageProps) {
  const { locale, slug } = await params
  const slugPath = slug?.join('/') ?? ''

  const routeKey = findRouteKeyBySlug(locale, slugPath)

  if (!routeKey || routeKey === 'home') {
    notFound()
  }

  switch (routeKey) {
    case 'devis':
      return <div>Page devis</div>

    case 'references':
      return <div>Page références</div>

    case 'calculateur':
      return <div>Page calculateur</div>

    case 'pac_fonctionnement':
      return <div>Page pompes à chaleur - fonctionnement</div>

    case 'pac_chauffage':
      return <div>Page pompes à chaleur - chauffage</div>

    case 'pac_climatisation':
      return <div>Page pompes à chaleur - climatisation</div>

    case 'pac_avantages':
      return <div>Page pompes à chaleur - avantages</div>

    case 'geo_fermee':
      return <div>Page géothermie fermée</div>

    case 'geo_ouverte':
      return <div>Page géothermie ouverte</div>

    case 'geo_fonctionnement':
      return <div>Page géothermie - fonctionnement</div>

    case 'particuliers_etapes':
      return <div>Page particuliers - étapes</div>

    case 'particuliers_installateurs':
      return <div>Page particuliers - installateurs</div>

    case 'pro_chauffagistes':
      return <div>Page pros - chauffagistes</div>

    case 'pro_architectes':
      return <div>Page pros - architectes</div>

    case 'pro_entrepreneurs':
      return <div>Page pros - entrepreneurs</div>

    case 'pro_soumission':
      return <div>Page pros - soumission</div>

    default:
      notFound()
  }
}
