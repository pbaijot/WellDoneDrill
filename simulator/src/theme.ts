
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
    height: '320px',
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



export const geologyLayerLegendStyles = {
  wrapper: (): React.CSSProperties => ({
    marginTop: '10px',
    marginBottom: '16px',
    display: 'grid',
    gap: '6px',
  }),

  item: (): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: '22px 1fr auto',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    border: '1px solid ' + C.border,
    background: C.bg,
    fontSize: F.xs,
    color: C.text2,
  }),

  number: (color: string): React.CSSProperties => ({
    width: '18px',
    height: '18px',
    borderRadius: '999px',
    background: color,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 700,
    textShadow: '0 1px 1px rgba(0,0,0,0.25)',
  }),

  name: (): React.CSSProperties => ({
    fontSize: F.sm,
    color: C.text,
    fontWeight: 600,
    lineHeight: 1.25,
  }),

  meta: (): React.CSSProperties => ({
    fontSize: F.xs,
    color: C.text4,
    lineHeight: 1.25,
    textAlign: 'right',
    whiteSpace: 'nowrap',
  }),

  hydroLegend: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
    marginTop: '8px',
    marginBottom: '16px',
    fontSize: F.xs,
    color: C.text4,
  }),

  hydroSample: (strong = true): React.CSSProperties => ({
    width: '44px',
    height: '14px',
    border: '1px solid rgba(21,101,192,0.35)',
    backgroundImage: strong
      ? 'repeating-linear-gradient(135deg, rgba(21,101,192,0.7) 0px, rgba(21,101,192,0.7) 2px, transparent 2px, transparent 9px)'
      : 'repeating-linear-gradient(135deg, rgba(21,101,192,0.55) 0px, rgba(21,101,192,0.55) 1px, transparent 1px, transparent 11px)',
    backgroundColor: 'rgba(21,101,192,0.04)',
  }),
} as const


export const geologySectionStyles = {
  statusBox: (kind: 'loading' | 'error' | 'ok' = 'ok'): React.CSSProperties => ({
    background: kind === 'error' ? '#FFF5F2' : C.bgSoft,
    border: '1px solid ' + (kind === 'error' ? C.orange : C.border),
    borderLeft: '3px solid ' + (kind === 'error' ? C.orange : C.accentDark),
    padding: '12px 14px',
    marginBottom: '16px',
    fontSize: F.base,
    color: C.text2,
    lineHeight: 1.55,
  }),

  metaGrid: (): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '16px',
  }),

  metaCard: (): React.CSSProperties => ({
    background: C.bg,
    border: '1px solid ' + C.border,
    padding: '10px 12px',
  }),

  metaLabel: (): React.CSSProperties => ({
    fontSize: F.xs,
    color: C.text4,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: '4px',
    fontWeight: 600,
  }),

  metaValue: (): React.CSSProperties => ({
    fontSize: F.md,
    color: C.text,
    fontWeight: 700,
  }),

  sectionShell: (): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: '42px minmax(0, 1fr)',
    gap: '14px',
    marginBottom: '10px',
  }),

  depthAxis: (): React.CSSProperties => ({
    width: '42px',
    flexShrink: 0,
    position: 'relative',
    height: '320px',
  }),

  depthLabel: (depthM: number, maxDepthM: number): React.CSSProperties => ({
    position: 'absolute',
    top: (depthM / maxDepthM * 100) + '%',
    right: '4px',
    transform: 'translateY(-50%)',
    fontSize: F.xs,
    color: C.text4,
    textAlign: 'right',
    lineHeight: 1,
  }),

  sectionCanvas: (): React.CSSProperties => ({
    height: '320px',
    position: 'relative',
    border: '1px solid ' + C.border,
    overflow: 'hidden',
    background: C.bgMuted,
  }),

  layerBlock: (topM: number, bottomM: number, maxDepthM: number, color: string): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (topM / maxDepthM * 100) + '%',
    height: ((bottomM - topM) / maxDepthM * 100) + '%',
    background: color,
    borderBottom: '1px solid rgba(0,0,0,0.14)',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    boxSizing: 'border-box',
  }),

  layerText: (): React.CSSProperties => ({
    fontSize: F.xs,
    color: 'rgba(255,255,255,0.96)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    lineHeight: 1.3,
    textShadow: '0 1px 1px rgba(0,0,0,0.3)',
  }),

  layerLegend: (): React.CSSProperties => ({
    display: 'grid',
    gap: '6px',
    marginTop: '10px',
    marginBottom: '16px',
  }),

  layerLegendItem: (): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: '22px 1fr auto',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    border: '1px solid ' + C.border,
    background: C.bg,
    fontSize: F.xs,
    color: C.text2,
  }),

  layerLegendNumber: (color: string): React.CSSProperties => ({
    width: '18px',
    height: '18px',
    borderRadius: '999px',
    background: color,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 700,
    textShadow: '0 1px 1px rgba(0,0,0,0.25)',
  }),

  layerLegendName: (): React.CSSProperties => ({
    fontSize: F.sm,
    color: C.text,
    fontWeight: 600,
    lineHeight: 1.25,
  }),

  layerLegendMeta: (): React.CSSProperties => ({
    fontSize: F.xs,
    color: C.text4,
    lineHeight: 1.25,
    textAlign: 'right',
    whiteSpace: 'nowrap',
  }),

  hydroLegend: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
    marginTop: '8px',
    marginBottom: '16px',
    fontSize: F.xs,
    color: C.text4,
  }),

  hydroSample: (strong = true): React.CSSProperties => ({
    width: '44px',
    height: '14px',
    border: '1px solid rgba(21,101,192,0.35)',
    backgroundImage: strong
      ? 'repeating-linear-gradient(135deg, rgba(21,101,192,0.7) 0px, rgba(21,101,192,0.7) 2px, transparent 2px, transparent 9px)'
      : 'repeating-linear-gradient(135deg, rgba(21,101,192,0.55) 0px, rgba(21,101,192,0.55) 1px, transparent 1px, transparent 11px)',
    backgroundColor: 'rgba(21,101,192,0.04)',
  }),

  evidenceList: (): React.CSSProperties => ({
    display: 'grid',
    gap: '6px',
    marginBottom: '16px',
  }),

  evidenceItem: (): React.CSSProperties => ({
    border: '1px solid ' + C.border,
    background: C.bg,
    padding: '9px 11px',
    fontSize: F.sm,
    color: C.text2,
    lineHeight: 1.45,
  }),

  evidenceType: (): React.CSSProperties => ({
    fontSize: F.xs,
    color: C.text4,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 700,
    marginBottom: '2px',
  }),

  warning: (): React.CSSProperties => ({
    background: '#FFFDF0',
    border: '1px solid #F9C84E',
    borderLeft: '3px solid ' + C.accentDark,
    padding: '12px 14px',
    marginBottom: '16px',
    fontSize: F.sm,
    color: C.text2,
    lineHeight: 1.55,
  }),
} as const
