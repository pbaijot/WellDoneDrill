import type React from 'react'

export const PROFILE_HEIGHT_PX = 400

export const S = {
  statusBox: (kind: 'loading' | 'error' | 'ok'): React.CSSProperties => ({
    background: kind === 'error' ? '#FFF5F2' : '#F8F5EF',
    border: '1px solid ' + (kind === 'error' ? '#E65100' : '#DDD8CF'),
    borderLeft: '3px solid ' + (kind === 'error' ? '#E65100' : '#E6C200'),
    padding: '12px 14px',
    marginBottom: '16px',
    fontSize: '13px',
    color: '#4A4540',
    lineHeight: 1.55,
  }),

  sectionTable: (): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: '64px minmax(360px, 520px) 170px minmax(720px, 1fr)',
    border: '1px solid #DDD8CF',
    background: '#FFFFFF',
    marginTop: '18px',
    marginBottom: '12px',
    overflow: 'hidden',
  }),

  depthHeader: (): React.CSSProperties => ({
    minHeight: '42px',
    borderRight: '1px solid #DDD8CF',
    borderBottom: '1px solid #DDD8CF',
    background: '#F2EFE9',
    position: 'relative',
  }),

  verticalDepthLabel: (): React.CSSProperties => ({
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    color: '#9A9088',
    whiteSpace: 'nowrap',
  }),

  tableHeader: (): React.CSSProperties => ({
    minHeight: '42px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    borderRight: '1px solid #DDD8CF',
    borderBottom: '1px solid #DDD8CF',
    background: '#F2EFE9',
    fontSize: '13px',
    fontWeight: 700,
    color: '#4A4540',
  }),

  depthAxis: (): React.CSSProperties => ({
    position: 'relative',
    height: PROFILE_HEIGHT_PX,
    borderRight: '1px solid #DDD8CF',
    background: '#F2EFE9',
  }),

  depthTick: (d: number, max: number): React.CSSProperties => ({
    position: 'absolute',
    top: (d / max * 100) + '%',
    right: '12px',
    transform: 'translateY(-50%)',
    fontSize: '11px',
    color: '#9A9088',
    fontWeight: 600,
  }),

  sectionCanvas: (): React.CSSProperties => ({
    position: 'relative',
    height: PROFILE_HEIGHT_PX,
    borderRight: '1px solid #DDD8CF',
    background: '#F2EFE9',
    overflow: 'hidden',
  }),

  layerBlock: (t: number, b: number, max: number, color: string): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (t / max * 100) + '%',
    height: ((b - t) / max * 100) + '%',
    background: color,
    borderBottom: '1px solid rgba(0,0,0,0.18)',
    boxSizing: 'border-box',
    overflow: 'hidden',
  }),

  layerNumber: (dark?: boolean): React.CSSProperties => ({
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '22px',
    height: '22px',
    borderRadius: '999px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: dark ? '#4A4540' : '#FFFFFF',
    background: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.42)',
    fontWeight: 800,
    lineHeight: 1,
    boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
  }),

  hydroOverlay: (t: number, b: number, max: number, strong: boolean): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (t / max * 100) + '%',
    height: ((b - t) / max * 100) + '%',
    pointerEvents: 'none',
    opacity: strong ? 0.58 : 0.34,
    zIndex: 5,
    backgroundImage: strong
      ? 'repeating-linear-gradient(135deg, rgba(21,101,192,0.95) 0px, rgba(21,101,192,0.95) 4px, transparent 4px, transparent 15px)'
      : 'repeating-linear-gradient(135deg, rgba(21,101,192,0.65) 0px, rgba(21,101,192,0.65) 2px, transparent 2px, transparent 14px)',
  }),

  waterLine: (d: number, max: number): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (d / max * 100) + '%',
    borderTop: '2px dashed #1565C0',
    zIndex: 8,
    pointerEvents: 'none',
  }),

  waterLineLabel: (d: number, max: number): React.CSSProperties => ({
    position: 'absolute',
    right: '8px',
    top: (d / max * 100) + '%',
    transform: 'translateY(-110%)',
    zIndex: 12,
    pointerEvents: 'none',
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid rgba(21,101,192,0.35)',
    color: '#1565C0',
    fontSize: '9px',
    fontWeight: 800,
    padding: '2px 5px',
    whiteSpace: 'nowrap',
  }),

  lambdaCurveSvg: (): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    zIndex: 9,
    pointerEvents: 'none',
  }),

  lambdaSegment: (leftPct: number, topPct: number, lengthPct: number, angleDeg: number): React.CSSProperties => ({
    position: 'absolute',
    left: leftPct + '%',
    top: topPct + '%',
    width: lengthPct + '%',
    height: '0px',
    borderTop: '2px solid #D12B2B',
    transform: `rotate(${angleDeg}deg)`,
    transformOrigin: '0 0',
    zIndex: 12,
    pointerEvents: 'none',
  }),

  lambdaScale: (): React.CSSProperties => ({
    position: 'absolute',
    left: '20%',
    right: '20%',
    top: '8px',
    height: '18px',
    zIndex: 11,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    pointerEvents: 'none',
  }),

  lambdaScaleTick: (): React.CSSProperties => ({
    width: '1px',
    height: '7px',
    background: 'rgba(209,43,43,0.7)',
  }),

  lambdaScaleLabel: (): React.CSSProperties => ({
    position: 'absolute',
    top: '8px',
    transform: 'translateX(-50%)',
    fontSize: '9px',
    color: '#A33',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  }),

  targetLine: (): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '4px',
    background: '#FFD94F',
    zIndex: 10,
  }),

  connectorColumn: (): React.CSSProperties => ({
    gridColumn: '3',
    gridRow: '2',
    position: 'relative',
    height: PROFILE_HEIGHT_PX,
    background: '#FFFFFF',
    borderLeft: '1px solid #DDD8CF',
    borderRight: '1px solid #DDD8CF',
    overflow: 'hidden',
  }),

  connectorSvg: (): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    pointerEvents: 'none',
  }),

  connectorLine: (): React.CSSProperties => ({
    fill: 'none',
    stroke: 'rgba(90,82,74,0.72)',
    strokeWidth: 0.65,
    vectorEffect: 'non-scaling-stroke',
  }),

  connectorDepthLabel: (yPct: number): React.CSSProperties => ({
    position: 'absolute',
    right: '8px',
    top: yPct + '%',
    transform: yPct >= 99 ? 'translateY(-100%)' : 'translateY(-50%)',
    zIndex: 5,
    padding: '1px 4px',
    background: '#FFFFFF',
    color: '#6B6057',
    fontSize: '10px',
    fontWeight: 800,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  }),

  lambdaColumn: (): React.CSSProperties => ({
    gridColumn: '4',
    gridRow: '2',
    position: 'relative',
    height: PROFILE_HEIGHT_PX,
    background: '#FFFFFF',
    overflow: 'hidden',
  }),

  lambdaSeparator: (yPct: number): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: yPct + '%',
    height: '1px',
    background: '#DDD8CF',
    zIndex: 6,
    pointerEvents: 'none',
  }),

  lambdaRow: (t: number, b: number, max: number): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (t / max * 100) + '%',
    height: ((b - t) / max * 100) + '%',
    minHeight: '46px',
    display: 'grid',
    gridTemplateColumns: '54px 1fr',
    alignItems: 'center',
    gap: '12px',
    padding: '4px 16px',
    boxSizing: 'border-box',
    background: '#FFFFFF',
    overflow: 'hidden',
    zIndex: 4,
  }),

  lambdaValue: (): React.CSSProperties => ({
    fontSize: '12px',
    fontWeight: 800,
    color: '#1C1C1C',
    lineHeight: 1.2,
    textAlign: 'right',
  }),

  lambdaLayerName: (): React.CSSProperties => ({
    fontSize: '10px',
    color: '#4A4540',
    lineHeight: 1.18,
    fontWeight: 700,
    marginTop: 0,
  }),

  lambdaLayerDepth: (): React.CSSProperties => ({
    display: 'block',
    fontSize: '8.5px',
    color: '#9A9088',
    fontWeight: 400,
    marginTop: '1px',
  }),

  legendRow: (): React.CSSProperties => ({
    display: 'flex',
    gap: '18px',
    flexWrap: 'wrap',
    fontSize: '11px',
    color: '#6B6057',
    margin: '10px 0 16px',
    alignItems: 'center',
  }),

  legendItem: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  }),

  redLineSample: (): React.CSSProperties => ({
    display: 'inline-block',
    width: '20px',
    height: '2px',
    background: '#D12B2B',
  }),

  yellowLineSample: (): React.CSSProperties => ({
    display: 'inline-block',
    width: '20px',
    height: '3px',
    background: '#FFD94F',
  }),

  hydroSample: (strong: boolean): React.CSSProperties => ({
    display: 'inline-block',
    width: '20px',
    height: '12px',
    backgroundImage: strong
      ? 'repeating-linear-gradient(135deg, rgba(21,101,192,0.9) 0, rgba(21,101,192,0.9) 3px, transparent 3px, transparent 10px)'
      : 'repeating-linear-gradient(135deg, rgba(21,101,192,0.58) 0, rgba(21,101,192,0.58) 1px, transparent 1px, transparent 11px)',
  }),

  summaryGrid: (): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '16px',
  }),

  summaryCard: (): React.CSSProperties => ({
    background: '#F8F5EF',
    border: '1px solid #DDD8CF',
    padding: '16px 18px',
  }),

  summaryLabel: (): React.CSSProperties => ({
    fontSize: '11px',
    color: '#9A9088',
    marginBottom: '4px',
  }),

  summaryValue: (color?: string): React.CSSProperties => ({
    fontSize: '22px',
    fontWeight: 700,
    color: color === 'green' ? '#2E7D32' : '#1C1C1C',
    marginBottom: '2px',
  }),

  summarySub: (): React.CSSProperties => ({
    fontSize: '10px',
    color: '#9A9088',
    marginTop: '2px',
  }),

  warning: (): React.CSSProperties => ({
    fontSize: '11px',
    color: '#6B6057',
    lineHeight: 1.6,
    padding: '10px 14px',
    background: '#F8F5EF',
    border: '1px solid #DDD8CF',
    borderLeft: '3px solid #DDD8CF',
    marginBottom: '10px',
  }),
}
