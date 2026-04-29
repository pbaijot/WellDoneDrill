
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

  sectionTable: (): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: '78px minmax(320px, 1fr) 300px 220px',
    border: '1px solid ' + C.border,
    background: C.bg,
    marginTop: '16px',
    marginBottom: '12px',
    overflow: 'hidden',
  }),

  depthHeader: (): React.CSSProperties => ({
    minHeight: '42px',
    borderRight: '1px solid ' + C.border,
    borderBottom: '1px solid ' + C.border,
    background: C.bgMuted,
    position: 'relative',
  }),

  verticalDepthLabel: (): React.CSSProperties => ({
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%) rotate(-90deg)',
    fontSize: F.xs,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: C.text4,
    whiteSpace: 'nowrap',
  }),

  tableHeader: (): React.CSSProperties => ({
    minHeight: '42px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    borderRight: '1px solid ' + C.border,
    borderBottom: '1px solid ' + C.border,
    background: C.bgMuted,
    fontSize: F.base,
    fontWeight: 700,
    color: C.text2,
  }),

  depthAxis: (): React.CSSProperties => ({
    position: 'relative',
    height: '420px',
    borderRight: '1px solid ' + C.border,
    background: C.bgMuted,
  }),

  depthTick: (depthM: number, maxDepthM: number): React.CSSProperties => ({
    position: 'absolute',
    top: (depthM / maxDepthM * 100) + '%',
    right: '12px',
    transform: 'translateY(-50%)',
    fontSize: F.xs,
    color: C.text4,
    fontWeight: 600,
  }),

  sectionCanvas: (): React.CSSProperties => ({
    position: 'relative',
    height: '420px',
    borderRight: '1px solid ' + C.border,
    background: C.bgMuted,
    overflow: 'hidden',
  }),

  layerBlock: (topM: number, bottomM: number, maxDepthM: number, color: string): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (topM / maxDepthM * 100) + '%',
    height: ((bottomM - topM) / maxDepthM * 100) + '%',
    background: color,
    borderBottom: '1px solid rgba(0,0,0,0.12)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 18px',
    boxSizing: 'border-box',
  }),

  layerName: (dark = false): React.CSSProperties => ({
    fontSize: '10px',
    color: dark ? C.text2 : '#fff',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    lineHeight: 1.2,
    textShadow: dark ? 'none' : '0 1px 1px rgba(0,0,0,0.28)',
  }),

  hydroOverlay: (topM: number, bottomM: number, maxDepthM: number, strong: boolean): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (topM / maxDepthM * 100) + '%',
    height: ((bottomM - topM) / maxDepthM * 100) + '%',
    pointerEvents: 'none',
    opacity: strong ? 0.62 : 0.42,
    backgroundImage: strong
      ? 'repeating-linear-gradient(135deg, rgba(21,101,192,0.95) 0px, rgba(21,101,192,0.95) 3px, transparent 3px, transparent 11px)'
      : 'repeating-linear-gradient(135deg, rgba(21,101,192,0.8) 0px, rgba(21,101,192,0.8) 2px, transparent 2px, transparent 13px)',
    zIndex: 5,
  }),

  waterLine: (depthM: number, maxDepthM: number): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (depthM / maxDepthM * 100) + '%',
    borderTop: '2px dashed #1565C0',
    zIndex: 8,
    pointerEvents: 'none',
  }),

  lambdaCurveSvg: (): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    zIndex: 9,
    pointerEvents: 'none',
  }),

  targetLine: (): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '4px',
    background: C.accent,
    zIndex: 10,
  }),

  lambdaColumn: (): React.CSSProperties => ({
    position: 'relative',
    height: '420px',
    borderRight: '1px solid ' + C.border,
    background: C.bg,
  }),

  lambdaRow: (topM: number, bottomM: number, maxDepthM: number): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (topM / maxDepthM * 100) + '%',
    height: ((bottomM - topM) / maxDepthM * 100) + '%',
    display: 'grid',
    gridTemplateColumns: '58px 1fr',
    alignItems: 'center',
    gap: '10px',
    padding: '0 14px',
    boxSizing: 'border-box',
  }),

  lambdaBar: (): React.CSSProperties => ({
    height: '2px',
    background: '#E68A8A',
  }),

  lambdaValue: (): React.CSSProperties => ({
    fontSize: F.sm,
    fontWeight: 700,
    color: C.text2,
    textAlign: 'right',
  }),


  lambdaLayerName: (): React.CSSProperties => ({
    fontSize: F.xs,
    color: C.text2,
    lineHeight: 1.25,
    fontWeight: 600,
  }),

  lambdaLayerDepth: (): React.CSSProperties => ({
    display: 'block',
    fontSize: '10px',
    color: C.text4,
    fontWeight: 500,
    marginTop: '2px',
  }),

  stratColumn: (): React.CSSProperties => ({
    position: 'relative',
    height: '420px',
    background: C.bg,
  }),

  stratRow: (topM: number, bottomM: number, maxDepthM: number): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (topM / maxDepthM * 100) + '%',
    height: ((bottomM - topM) / maxDepthM * 100) + '%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 18px',
    boxSizing: 'border-box',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    fontSize: F.sm,
    color: C.text2,
    lineHeight: 1.35,
  }),

  legendRow: (): React.CSSProperties => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '16px',
    fontSize: F.sm,
    color: C.text4,
  }),

  legendItem: (): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  }),

  redLineSample: (): React.CSSProperties => ({
    width: '36px',
    height: '3px',
    background: '#D12B2B',
  }),

  yellowLineSample: (): React.CSSProperties => ({
    width: '46px',
    height: '4px',
    background: C.accent,
  }),

  hydroSample: (strong = true): React.CSSProperties => ({
    width: '46px',
    height: '14px',
    border: '1px solid rgba(21,101,192,0.35)',
    backgroundImage: strong
      ? 'repeating-linear-gradient(135deg, rgba(21,101,192,0.7) 0px, rgba(21,101,192,0.7) 2px, transparent 2px, transparent 9px)'
      : 'repeating-linear-gradient(135deg, rgba(21,101,192,0.55) 0px, rgba(21,101,192,0.55) 1px, transparent 1px, transparent 11px)',
    backgroundColor: 'rgba(21,101,192,0.04)',
  }),

  summaryGrid: (): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  }),

  summaryCard: (): React.CSSProperties => ({
    background: C.bgSoft,
    border: '1px solid ' + C.border,
    padding: '16px 18px',
  }),

  summaryLabel: (): React.CSSProperties => ({
    fontSize: F.base,
    color: C.text3,
    marginBottom: '6px',
    fontWeight: 600,
  }),

  summaryValue: (tone: 'normal' | 'green' = 'normal'): React.CSSProperties => ({
    fontSize: F.h2,
    color: tone === 'green' ? C.green : C.text,
    fontWeight: 800,
    lineHeight: 1.1,
  }),

  summarySub: (): React.CSSProperties => ({
    fontSize: F.sm,
    color: C.text4,
    marginTop: '4px',
    lineHeight: 1.4,
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
