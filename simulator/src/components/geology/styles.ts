import type React from 'react'

import {
  RIGHT_PANEL_OFFSET_PX,
  RIGHT_PANEL_WIDTH_PX,
} from '../layout/layoutConstants'

export const PROFILE_HEIGHT_PX = 400
export const GEO_COLUMN_WIDTH_PX = 225

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
    gridTemplateColumns: `64px ${GEO_COLUMN_WIDTH_PX}px ${GEO_COLUMN_WIDTH_PX}px 170px minmax(520px, 1fr)`,
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


  hydroColumnCanvas: (): React.CSSProperties => ({
    position: 'relative',
    height: PROFILE_HEIGHT_PX,
    borderRight: '1px solid #DDD8CF',
    background: '#F8FAFC',
    overflow: 'hidden',
  }),

  hydroColumnBand: (
    topM: number,
    bottomM: number,
    maxDepthM: number,
    mode: 'aquifer' | 'fracture' | 'none'
  ): React.CSSProperties => {
    const isAquifer = mode === 'aquifer'

    return {
      position: 'absolute',
      left: 0,
      right: 0,
      top: (topM / maxDepthM * 100) + '%',
      height: ((bottomM - topM) / maxDepthM * 100) + '%',
      pointerEvents: 'none',
      backgroundColor: isAquifer
        ? 'rgba(21,101,192,0.10)'
        : 'rgba(21,101,192,0.04)',
      backgroundImage: isAquifer
        ? 'repeating-linear-gradient(135deg, rgba(21,101,192,0.82) 0px, rgba(21,101,192,0.82) 4px, transparent 4px, transparent 15px)'
        : 'repeating-linear-gradient(135deg, rgba(21,101,192,0.48) 0px, rgba(21,101,192,0.48) 2px, transparent 2px, transparent 14px)',
      borderTop: '1px solid rgba(21,101,192,0.20)',
      borderBottom: '1px solid rgba(21,101,192,0.20)',
      boxSizing: 'border-box',
      zIndex: 4,
    }
  },

  hydroColumnText: (
    topM: number,
    bottomM: number,
    maxDepthM: number,
    strong: boolean
  ): React.CSSProperties => ({
    position: 'absolute',
    left: '8px',
    right: '8px',
    top: (((topM + bottomM) / 2) / maxDepthM * 100) + '%',
    transform: 'translateY(-50%)',
    zIndex: 8,
    fontSize: '9px',
    fontWeight: 800,
    lineHeight: 1.2,
    color: strong ? '#1565C0' : '#477AB8',
    background: 'rgba(255,255,255,0.78)',
    border: '1px solid rgba(21,101,192,0.22)',
    padding: '3px 5px',
    textAlign: 'center',
    pointerEvents: 'none',
  }),

  hydroColumnWaterLine: (depthM: number, maxDepthM: number): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (depthM / maxDepthM * 100) + '%',
    borderTop: '2px dashed #1565C0',
    zIndex: 10,
    pointerEvents: 'none',
  }),

  hydroColumnWaterLabel: (depthM: number, maxDepthM: number): React.CSSProperties => ({
    position: 'absolute',
    left: '8px',
    right: '8px',
    top: (depthM / maxDepthM * 100) + '%',
    transform: 'translateY(-115%)',
    zIndex: 12,
    pointerEvents: 'none',
    background: 'rgba(255,255,255,0.94)',
    border: '1px solid rgba(21,101,192,0.35)',
    color: '#1565C0',
    fontSize: '9px',
    fontWeight: 800,
    padding: '3px 5px',
    textAlign: 'center',
    lineHeight: 1.2,
  }),

  hydroColumnEmpty: (): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    textAlign: 'center',
    fontSize: '9px',
    color: '#9A9088',
    lineHeight: 1.35,
    pointerEvents: 'none',
  }),

  connectorColumn: (): React.CSSProperties => ({
    gridColumn: '4',
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
    gridColumn: '5',
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
    display: 'none',
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


  geologyLayout: (): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: `minmax(0, 1fr) ${RIGHT_PANEL_WIDTH_PX}px`,
    gap: '18px',
    alignItems: 'start',
    width: '100%',
    paddingRight: RIGHT_PANEL_OFFSET_PX,
    boxSizing: 'border-box',
  }),

  geologyMain: (): React.CSSProperties => ({
    minWidth: 0,
  }),

  geologySidePanel: (): React.CSSProperties => ({
    position: 'sticky',
    top: '18px',
    alignSelf: 'start',
    width: '100%',
    border: '1px solid #DDD8CF',
    background: 'rgba(255, 255, 255, 0.96)',
    padding: '14px',
    boxShadow: '0 12px 36px rgba(0,0,0,0.10)',
    boxSizing: 'border-box',
  }),


  probeDepthLine: (depthM: number, maxDepthM: number): React.CSSProperties => {
    const bottomPct = Math.max(0, Math.min(100, (depthM / maxDepthM) * 100))

    return {
      position: 'absolute',
      left: '54%',
      top: 0,
      height: bottomPct + '%',
      width: '10px',
      transform: 'translateX(-50%)',
      zIndex: 18,
      pointerEvents: 'none',
      borderLeft: '3px solid #1A1A1A',
      borderRight: '3px solid #1A1A1A',
      borderBottom: '3px solid #1A1A1A',
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
      boxSizing: 'border-box',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.28))',
    }
  },

  probeHead: (): React.CSSProperties => ({
    position: 'absolute',
    left: '54%',
    top: '0px',
    width: '22px',
    height: '10px',
    transform: 'translateX(-50%)',
    zIndex: 19,
    pointerEvents: 'none',
    background: '#1A1A1A',
    borderRadius: '2px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.22)',
  }),

  probeDepthLabel: (depthM: number, maxDepthM: number): React.CSSProperties => {
    const topPct = Math.max(5, Math.min(96, (depthM / maxDepthM) * 100))

    return {
      position: 'absolute',
      left: 'calc(54% + 16px)',
      top: topPct + '%',
      transform: 'translateY(-50%)',
      zIndex: 20,
      pointerEvents: 'none',
      background: 'rgba(255,255,255,0.94)',
      border: '1px solid #DDD8CF',
      color: '#1A1A1A',
      fontSize: '9px',
      fontWeight: 800,
      padding: '2px 5px',
      whiteSpace: 'nowrap',
      boxShadow: '0 1px 3px rgba(0,0,0,0.16)',
    }
  },

  sideInput: (): React.CSSProperties => ({
    width: '100%',
    border: '1px solid #DDD8CF',
    padding: '10px 12px',
    fontSize: '18px',
    fontWeight: 800,
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    background: '#FFFFFF',
    color: '#1C1C1C',
  }),

  sidePanelTitle: (): React.CSSProperties => ({
    fontSize: '13px',
    fontWeight: 800,
    color: '#4A4540',
    marginBottom: '12px',
  }),


  knowledgeBox: (): React.CSSProperties => ({
    borderTop: '1px solid #DDD8CF',
    padding: '14px 0',
  }),

  knowledgeBadge: (): React.CSSProperties => ({
    display: 'inline-block',
    background: '#FFFDF0',
    border: '1px solid #F9C84E',
    color: '#4A4540',
    fontSize: '10px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    padding: '4px 7px',
    marginBottom: '8px',
  }),

  knowledgeTitle: (): React.CSSProperties => ({
    fontSize: '14px',
    fontWeight: 800,
    color: '#1C1C1C',
    marginBottom: '6px',
    lineHeight: 1.3,
  }),

  knowledgeText: (): React.CSSProperties => ({
    fontSize: '11px',
    color: '#6B6057',
    lineHeight: 1.5,
    marginTop: '4px',
  }),

  knowledgeMiniGrid: (): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
    marginTop: '10px',
  }),

  knowledgeMiniCard: (): React.CSSProperties => ({
    background: '#F8F5EF',
    border: '1px solid #DDD8CF',
    padding: '8px',
  }),

  knowledgeMiniLabel: (): React.CSSProperties => ({
    fontSize: '9px',
    color: '#9A9088',
    marginBottom: '3px',
  }),

  knowledgeMiniValue: (): React.CSSProperties => ({
    fontSize: '12px',
    fontWeight: 800,
    color: '#1C1C1C',
    lineHeight: 1.25,
  }),

  sideMetric: (): React.CSSProperties => ({
    borderTop: '1px solid #DDD8CF',
    padding: '14px 0',
  }),

  sideMetricLabel: (): React.CSSProperties => ({
    fontSize: '11px',
    color: '#9A9088',
    marginBottom: '6px',
  }),

  sideMetricValue: (color?: string): React.CSSProperties => ({
    fontSize: '24px',
    fontWeight: 800,
    color: color === 'green' ? '#2E7D32' : '#1C1C1C',
    lineHeight: 1.15,
  }),

  sideMetricSub: (): React.CSSProperties => ({
    fontSize: '11px',
    color: '#9A9088',
    marginTop: '4px',
    lineHeight: 1.45,
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
