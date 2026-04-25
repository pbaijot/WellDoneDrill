
'use client'
import { useState } from 'react'
import type { TreeStep } from '../types'
import { C, F } from '../theme'
import { T } from '../i18n/fr'
import { Hint, QTitle } from './Shared'

export default function MultiChoiceStep({ step, onAnswer }: {
  step: TreeStep
  onAnswer: (value: string, next: string) => void
}) {
  const [selected, setSelected] = useState<string[]>([])

  function toggle(val: string) {
    if (val === 'aucun' || val === 'inconnu') { setSelected([val]); return }
    setSelected((prev) =>
      prev.includes(val)
        ? prev.filter((v) => v !== val)
        : [...prev.filter((v) => v !== 'aucun' && v !== 'inconnu'), val]
    )
  }

  const ready = selected.length > 0

  return (
    <div>
      {step.hint && <Hint>{step.hint}</Hint>}
      <QTitle>{step.question}</QTitle>
      <div style={{ marginBottom: '16px' }}>
        {(step.multiOptions || []).map((opt) => {
          const active = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', width: '100%', textAlign: 'left', background: active ? '#FFFDF0' : C.bgSoft, border: '1.5px solid ' + (active ? C.accentDark : C.border), marginBottom: '4px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <div style={{ width: '16px', height: '16px', flexShrink: 0, border: '1.5px solid ' + (active ? C.accentDark : C.borderStrong), background: active ? C.accent : C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {active && <span style={{ fontSize: '10px', fontWeight: 700, color: '#1A1A1A' }}>✓</span>}
              </div>
              <span style={{ fontSize: F.md, color: C.text }}>{opt.label}</span>
            </button>
          )
        })}
      </div>
      <button
        onClick={() => ready && onAnswer(selected.join(','), step.next || 'result')}
        style={{ display: 'block', width: '100%', padding: '14px', background: ready ? C.accent : C.bgMuted, color: ready ? '#1A1A1A' : C.text4, fontSize: F.md, fontWeight: 700, textAlign: 'center', border: 'none', cursor: ready ? 'pointer' : 'default', fontFamily: 'inherit' }}
      >
        {T.continue}
      </button>
    </div>
  )
}
