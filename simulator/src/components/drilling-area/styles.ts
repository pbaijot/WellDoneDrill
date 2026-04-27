import type React from 'react'

export const DRILLING_MAP_HEIGHT = '100%'

export const S = {
  intro: (): React.CSSProperties => ({
    position: 'absolute',
    left: '18px',
    top: '18px',
    maxWidth: '760px',
    zIndex: 700,
    fontSize: '13px',
    color: '#4A4540',
    lineHeight: 1.6,
    padding: '12px 14px',
    background: 'rgba(248, 245, 239, 0.94)',
    border: '1px solid #DDD8CF',
    borderLeft: '3px solid #E6C200',
    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
  }),

  layout: (): React.CSSProperties => ({
    position: 'fixed',
    left: 0,
    right: 0,
    top: '42px',
    bottom: 0,
    width: '100vw',
    height: `calc(100dvh - 42px)`,
    overflow: 'hidden',
    background: '#E7E0D6',
    zIndex: 20,
  }),

  mapShell: (): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    border: 'none',
    background: '#FFFFFF',
    overflow: 'hidden',
    minWidth: 0,
  }),

  map: (): React.CSSProperties => ({
    height: '100%',
    width: '100%',
    position: 'relative',
  }),

  panel: (): React.CSSProperties => ({
    position: 'absolute',
    right: '18px',
    top: '18px',
    bottom: '18px',
    width: '320px',
    overflowY: 'auto',
    border: '1px solid #DDD8CF',
    background: 'rgba(255, 255, 255, 0.96)',
    padding: '14px',
    boxShadow: '0 12px 36px rgba(0,0,0,0.16)',
    zIndex: 710,
  }),

  panelTitle: (): React.CSSProperties => ({
    fontSize: '13px',
    fontWeight: 800,
    color: '#1C1C1C',
    marginBottom: '10px',
  }),

  metric: (): React.CSSProperties => ({
    padding: '12px 0',
    borderBottom: '1px solid #DDD8CF',
  }),

  metricLabel: (): React.CSSProperties => ({
    fontSize: '11px',
    color: '#9A9088',
    marginBottom: '4px',
  }),

  metricValue: (): React.CSSProperties => ({
    fontSize: '22px',
    fontWeight: 800,
    color: '#1C1C1C',
  }),

  help: (): React.CSSProperties => ({
    fontSize: '11px',
    color: '#6B6057',
    lineHeight: 1.55,
    marginTop: '12px',
  }),

  buttonRow: (): React.CSSProperties => ({
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
    flexWrap: 'wrap',
  }),

  secondaryButton: (): React.CSSProperties => ({
    border: '1px solid #DDD8CF',
    background: '#FFFFFF',
    color: '#4A4540',
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  }),
}
