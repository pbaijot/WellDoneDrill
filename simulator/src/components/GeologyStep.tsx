
'use client'
import { C, F } from '../theme'
import { T } from '../i18n/fr'
import { Hint, PrimaryBtn } from './Shared'

const LAYERS = [
  { name: 'Sol vegetal', from: 0, to: 4, color: '#8B6F47' },
  { name: 'Limon', from: 4, to: 15, color: '#C4A882' },
  { name: 'Sable', from: 15, to: 35, color: '#D4C5A0' },
  { name: 'Argile', from: 35, to: 70, color: '#9E7B5A' },
  { name: 'Calcaire', from: 70, to: 130, color: '#B8B0A0' },
  { name: 'Schiste', from: 130, to: 200, color: '#6B6560' },
]
const DEPTHS = [0, 50, 100, 150, 200]
const CONDUCTIVITY = ['~3.5 W/mK', '~3.5 W/mK', '~2.8 W/mK', '~2.0 W/mK', '~2.8 W/mK', '~2.8 W/mK']

export default function GeologyStep({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div>
      <Hint>{T.geologyIntro}</Hint>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ width: '40px', flexShrink: 0, position: 'relative', height: '260px' }}>
          {DEPTHS.map((d) => (
            <div key={d} style={{ position: 'absolute', top: (d / 200 * 100) + '%', right: '4px', transform: 'translateY(-50%)', fontSize: '10px', color: C.text4, textAlign: 'right', lineHeight: 1 }}>
              {d} m
            </div>
          ))}
        </div>
        <div style={{ flex: 1, height: '260px', position: 'relative', border: '1px solid ' + C.border, overflow: 'hidden' }}>
          {LAYERS.map((layer) => (
            <div key={layer.name} style={{ position: 'absolute', left: 0, right: 0, top: (layer.from / 200 * 100) + '%', height: ((layer.to - layer.from) / 200 * 100) + '%', background: layer.color, borderBottom: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', paddingLeft: '12px', boxSizing: 'border-box' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{layer.name}</span>
            </div>
          ))}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: C.accent }} />
        </div>
        <div style={{ width: '88px', flexShrink: 0, height: '260px', position: 'relative' }}>
          {LAYERS.map((layer, i) => (
            <div key={layer.name} style={{ position: 'absolute', top: ((layer.from + layer.to) / 2 / 200 * 100) + '%', transform: 'translateY(-50%)', lineHeight: 1.4 }}>
              <div style={{ color: '#B8860B', fontWeight: 600, fontSize: '10px' }}>{CONDUCTIVITY[i]}</div>
              <div style={{ fontSize: '9px', color: C.text4 }}>{T.geologyConductivite}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: C.bgSoft, border: '1px solid ' + C.border, borderLeft: '3px solid ' + C.accentDark, padding: '14px 16px', marginBottom: '20px' }}>
        <div style={{ fontSize: F.base, fontWeight: 600, color: C.text, marginBottom: '4px' }}>{T.geologyPotentialTitle}</div>
        <div style={{ fontSize: F.sm, color: C.text3, lineHeight: 1.6 }}>{T.geologyPotentialText}</div>
        <div style={{ fontSize: F.xs, color: C.text4, marginTop: '6px' }}>{T.geologyNote}</div>
      </div>
      <PrimaryBtn onClick={onConfirm}>{T.geologyConfirm}</PrimaryBtn>
    </div>
  )
}
