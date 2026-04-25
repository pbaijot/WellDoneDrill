
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



export const regulatoryMapStyles = {
  mapFrame: (): React.CSSProperties => ({
    height: '280px',
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid ' + C.border,
    boxSizing: 'border-box',
  }),

  mapCanvas: (): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
  }),

  legendWrapper: (): React.CSSProperties => ({
    marginTop: '18px',
  }),

  legendTitle: (): React.CSSProperties => ({
    color: C.text4,
    fontSize: F.xs,
    letterSpacing: '0.24em',
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: '10px',
    lineHeight: 1.4,
  }),

  legendList: (): React.CSSProperties => ({
    display: 'grid',
    gap: '6px',
  }),

  legendItem: (visible: boolean, color: string): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: '44px 1fr 18px',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    minHeight: '72px',
    padding: '12px 16px',
    border: '1px solid ' + C.border,
    borderLeft: visible ? '4px solid ' + color : '1px solid ' + C.border,
    background: visible ? C.bgSoft : C.bg,
    cursor: 'pointer',
    textAlign: 'left',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }),

  statusSymbol: (color: string): React.CSSProperties => ({
    color,
    fontSize: F.h2,
    fontWeight: 700,
    lineHeight: 1,
    textAlign: 'center',
  }),

  itemTitle: (): React.CSSProperties => ({
    display: 'block',
    color: C.text,
    fontSize: F.lg,
    fontWeight: 700,
    lineHeight: 1.25,
  }),

  itemSubtitle: (): React.CSSProperties => ({
    display: 'block',
    color: C.text4,
    fontSize: F.base,
    lineHeight: 1.35,
    marginTop: '4px',
  }),

  visibilityDot: (visible: boolean, color: string): React.CSSProperties => ({
    width: '10px',
    height: '10px',
    borderRadius: '999px',
    justifySelf: 'end',
    background: visible ? color : C.border,
  }),
} as const
