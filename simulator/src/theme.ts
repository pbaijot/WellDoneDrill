
export const C = {
  bg:           '#FFFFFF',
  bgSoft:       '#F8F5EF',
  bgMuted:      '#F2EFE9',
  border:       '#DDD8CF',
  borderStrong: '#B8B0A0',
  text:         '#1C1C1C',
  text2:        '#4A4540',
  text3:        '#6B6057',
  text4:        '#9A9088',
  accent:       '#FFD94F',
  accentDark:   '#E6C200',
  green:        '#2E7D32',
  red:          '#C62828',
  orange:       '#E65100',
  blue:         '#1565C0',
  purple:       '#6B21A8',
} as const

export const F = {
  xs:   '11px',
  sm:   '12px',
  base: '13px',
  md:   '14px',
  lg:   '15px',
  xl:   '16px',
  h2:   '20px',
} as const

export const hint = (accentColor = C.accentDark): React.CSSProperties => ({
  fontSize: F.base, color: C.text2, lineHeight: 1.6,
  padding: '10px 14px',
  borderLeft: '3px solid ' + accentColor,
  background: C.bgSoft,
  marginBottom: '16px',
})

export const btn = {
  primary: (color = C.accent): React.CSSProperties => ({
    display: 'block', width: '100%', padding: '14px',
    background: color, color: '#1A1A1A',
    fontSize: F.md, fontWeight: 700, textAlign: 'center' as const,
    border: 'none', cursor: 'pointer', marginBottom: '6px',
    boxSizing: 'border-box' as const, textDecoration: 'none',
    fontFamily: 'inherit',
  }),
  secondary: (): React.CSSProperties => ({
    display: 'block', width: '100%', padding: '12px',
    background: 'none', color: C.text3,
    fontSize: F.base, textAlign: 'center' as const,
    border: '1px solid ' + C.border, cursor: 'pointer',
    boxSizing: 'border-box' as const, textDecoration: 'none',
    fontFamily: 'inherit',
  }),
}

export const card = (): React.CSSProperties => ({
  background: C.bgSoft, border: '1px solid ' + C.border,
  padding: '16px',
})

export const input = (hasError = false): React.CSSProperties => ({
  flex: 1, border: '1.5px solid ' + (hasError ? C.red : C.border),
  background: C.bg, color: C.text, fontSize: F.md,
  padding: '11px 13px', outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box' as const,
})

export const sectionBadgeNum = (): React.CSSProperties => ({
  width: '22px', height: '22px', background: C.accent,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: F.xs, fontWeight: 700, color: '#1A1A1A', flexShrink: 0,
})

export const sectionBadgeLabel = (): React.CSSProperties => ({
  fontSize: F.xs, fontWeight: 600, letterSpacing: '0.14em',
  textTransform: 'uppercase' as const, color: C.text4,
})
