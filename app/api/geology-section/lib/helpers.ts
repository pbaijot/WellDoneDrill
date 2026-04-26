import type { EvidencePoint } from "./types"

export function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

export function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}

export function metersToLat(meters: number) {
  return meters / 111_320
}

export function metersToLng(meters: number, lat: number) {
  return meters / (111_320 * Math.cos(degToRad(lat)))
}

export function haversineM(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6_371_000
  const dLat = degToRad(bLat - aLat)
  const dLng = degToRad(bLng - aLng)
  const p1 = degToRad(aLat)
  const p2 = degToRad(bLat)

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dLng / 2) ** 2

  return 2 * R * Math.asin(Math.sqrt(x))
}

export function cleanText(value: any): string {
  if (value === null || value === undefined) return ""

  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function attrsText(attributes: Record<string, any>) {
  return Object.values(attributes || {})
    .map(cleanText)
    .filter(Boolean)
    .join(" ")
}

export function featureSummary(attributes: Record<string, any>) {
  const preferred = [
    "NOM",
    "NAME",
    "FORMATION",
    "FORM",
    "UNITE",
    "UNITE_GEO",
    "LITHO",
    "LITHOLOGIE",
    "DESCRIPTION",
    "DESCRIPTIO",
    "COMMENTAIRE",
    "REMARQUE",
    "TYPE",
    "CODE",
    "SERIE",
    "SIGLE",
    "NOM_CARTE",
    "DISTRICT",
    "SECTEUR",
    "DOMAINE",
  ]

  const parts: string[] = []

  for (const key of preferred) {
    const found = Object.keys(attributes || {}).find((k) => k.toUpperCase() === key)

    if (found) {
      const v = cleanText(attributes[found])
      if (v && !parts.includes(v)) parts.push(v)
    }
  }

  if (parts.length > 0) return parts.slice(0, 5).join(" — ")

  return Object.entries(attributes || {})
    .slice(0, 6)
    .map(([k, v]) => `${k}: ${cleanText(v)}`)
    .join(" — ")
}

export function allEvidenceText(items: EvidencePoint[]) {
  return items
    .map((item) => attrsText(item.attributes) + " " + item.summary)
    .join(" ")
    .toLowerCase()
}

export function buildTransect(
  lat: number,
  lng: number,
  lengthM: number,
  orientationDeg: number,
  sampleCount: number
) {
  const angle = degToRad(orientationDeg)
  const half = lengthM / 2

  return Array.from({ length: sampleCount }, (_, i) => {
    const ratio = sampleCount === 1 ? 0.5 : i / (sampleCount - 1)
    const distanceFromCenter = -half + ratio * lengthM
    const north = Math.cos(angle) * distanceFromCenter
    const east = Math.sin(angle) * distanceFromCenter

    return {
      index: i,
      distanceM: Math.round(distanceFromCenter + half),
      lat: lat + metersToLat(north),
      lng: lng + metersToLng(east, lat),
    }
  })
}
