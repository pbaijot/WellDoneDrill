
'use client'
import { C, F, sectionBadgeNum, sectionBadgeLabel } from '../theme'
import { T } from '../i18n/fr'
import type { Phase } from '../hooks/useSimulator'
import { SECTION_LABELS } from '../tree'

export function BackBtn({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: F.base, color: C.text3, padding: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}
    >
      {T.back}
    </button>
  )
}

export function SectionBadge({ n, label }: { n?: number; label?: string }) {
  if (!n && !label) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
      {n && <div style={sectionBadgeNum()}>{n}</div>}
      <span style={sectionBadgeLabel()}>{label || (n ? SECTION_LABELS[n] : '')}</span>
    </div>
  )
}

export function Hint({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontSize: F.base, color: C.text2, lineHeight: 1.6, padding: '10px 14px', borderLeft: '3px solid ' + (color || C.accentDark), background: C.bgSoft, marginBottom: '16px' }}>
      {children}
    </div>
  )
}

export function QTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: F.lg, fontWeight: 600, color: C.text, marginBottom: '16px' }}>{children}</div>
}

export function PrimaryBtn({ onClick, href, children, color }: { onClick?: () => void; href?: string; children: React.ReactNode; color?: string }) {
  const style: React.CSSProperties = {
    display: 'block', width: '100%', padding: '14px',
    background: color || C.accent, color: '#1A1A1A',
    fontSize: F.md, fontWeight: 700, textAlign: 'center',
    border: 'none', cursor: 'pointer', marginBottom: '6px',
    boxSizing: 'border-box', textDecoration: 'none', fontFamily: 'inherit',
  }
  if (href) return <a href={href} style={style}>{children}</a>
  return <button onClick={onClick} style={style}>{children}</button>
}

export function SecondaryBtn({ onClick, href, children }: { onClick?: () => void; href?: string; children: React.ReactNode }) {
  const style: React.CSSProperties = {
    display: 'block', width: '100%', padding: '12px',
    background: 'none', color: C.text3, fontSize: F.base,
    textAlign: 'center', border: '1px solid ' + C.border,
    cursor: 'pointer', boxSizing: 'border-box', textDecoration: 'none', fontFamily: 'inherit',
  }
  if (href) return <a href={href} style={style}>{children}</a>
  return <button onClick={onClick} style={style}>{children}</button>
}

export function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: F.xs, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: C.text4, marginBottom: '12px' }}>
      {children}
    </div>
  )
}
