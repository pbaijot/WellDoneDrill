// Shared logic: decide which string values in a Sanity doc are human-readable
// (translatable) vs technical (ids, refs, slugs, enums, urls, colors…).

// Keys whose string value is NEVER translated.
export const SKIP_KEYS = new Set([
  '_id', '_type', '_key', '_ref', '_weak', '_rev', '_createdAt', '_updatedAt',
  'asset', 'locale', 'routeKey', 'current', 'slug', 'url', 'videoUrl', 'href',
  'image', 'icon', 'iconName', 'hotspot', 'crop', 'country', 'type', 'sector',
  'segment', 'variant', 'ctaRouteKey', 'fmtLocale', 'mimeType', 'extension',
  'originalFilename', 'style', 'listItem', 'markDefs', 'level', 'color', 'bg',
])

// Enum-ish values that must stay as-is even if under a translatable-looking key.
const ENUM_VALUES = new Set([
  'fermee', 'ouverte', 'residentiel', 'tertiaire', 'public', 'industrie',
  'BE', 'FR', 'LU', 'left', 'right', 'center', 'dark', 'clay', 'normal',
  'h1', 'h2', 'h3', 'h4', 'blockquote', 'block', 'span', 'bullet', 'number',
])

export function isTranslatableValue(key, value) {
  if (typeof value !== 'string') return false
  if (SKIP_KEYS.has(key)) return false
  const v = value.trim()
  if (!v) return false
  if (ENUM_VALUES.has(v)) return false
  // URLs / paths / anchors / colors / emails
  if (/^(https?:|mailto:|tel:|\/|#|www\.)/i.test(v)) return false
  if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return false
  if (/\S+@\S+\.\S+/.test(v) && v.split(/\s+/).length === 1) return false
  // pure numbers / measurements with no letters
  if (/^[\d\s.,+\-–—%€$°/x×m²·:]+$/.test(v)) return false
  // single lowercase token with no spaces (likely an enum/key)
  if (/^[a-z][a-z0-9_-]*$/.test(v) && !v.includes(' ')) return false
  // must contain at least one letter
  if (!/[a-zA-ZÀ-ÿ]/.test(v)) return false
  return true
}

// Walk a doc, calling fn(key, value, setter) for every translatable string.
export function walkStrings(node, fn, parentKey = '') {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const child = node[i]
      if (typeof child === 'string') {
        if (isTranslatableValue(parentKey, child)) {
          const nv = fn(parentKey, child)
          if (nv !== undefined) node[i] = nv
        }
      } else {
        walkStrings(child, fn, parentKey)
      }
    }
  } else if (node && typeof node === 'object') {
    for (const k of Object.keys(node)) {
      const val = node[k]
      if (typeof val === 'string') {
        if (isTranslatableValue(k, val)) {
          const nv = fn(k, val)
          if (nv !== undefined) node[k] = nv
        }
      } else {
        walkStrings(val, fn, k)
      }
    }
  }
}
