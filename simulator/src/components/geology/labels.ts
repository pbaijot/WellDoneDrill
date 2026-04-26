import type { ApiLayer } from './types'

export function layerLongLabel(layer: ApiLayer) {
  return layer.display?.longLabel || layer.name
}

export function hydroLabel(value: ApiLayer['hydroClass']) {
  if (value === 'aquifer') return 'aquifère'
  if (value === 'aquitard') return 'aquitard'
  if (value === 'aquiclude') return 'aquiclude'
  return 'hydrogéologie à confirmer'
}

export function lithologyTextLabel(layer: ApiLayer) {
  switch (layer.lithologyCategory) {
    case 'argile':
      return 'Argile'
    case 'argile_silt':
      return 'Argile / silt'
    case 'silt_sable_argile':
      return 'Silt / sable et argile'
    case 'sable':
      return 'Sable'
    case 'sable_gravier':
      return 'Sable et gravier'
    case 'craie':
      return 'Craie'
    case 'schiste_gres_socle':
      return 'Schiste et grès, roche de socle'
    default:
      switch (layer.lithology) {
        case 'soil':
          return 'Sol / couverture superficielle'
        case 'loam':
          return 'Limon / lœss'
        case 'clay':
          return 'Argile'
        case 'sand':
          return 'Sable'
        case 'limestone':
          return 'Calcaire / craie'
        case 'schist':
          return 'Schiste'
        case 'sandstone':
          return 'Grès'
        case 'mixed':
          return 'Lithologie mixte'
        default:
          return 'Lithologie à confirmer'
      }
  }
}

export function confidenceLabel(value: 'low' | 'medium' | 'high') {
  if (value === 'high') return 'Élevée'
  if (value === 'medium') return 'Moyenne'
  return 'Faible'
}

export function potentialLabel(value: 'favorable' | 'moderate' | 'unknown') {
  if (value === 'favorable') return 'Favorable'
  if (value === 'moderate') return 'Modéré'
  return 'À confirmer'
}
