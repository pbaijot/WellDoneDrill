'use client'
import { useState } from 'react'
import type { TreeStep } from './types'

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

  return (
    <div>
      {step.hint && (
        <div style={{ fontSize: '13px', color: '#4A4540', lineHeight: 1.6, padding: '10px 14px', borderLeft: '3px solid #FFD94F', background: '#F8F5EF', marginBottom: '16px' }}>
          {step.hint}
        </div>
      )}
      <div style={{ fontSize: '15px', fontWeight: 600, color: '#1C1C1C', marginBottom: '16px' }}>
        {step.question}
      </div>
      <div style={{ marginBottom: '16px' }}>
        {(step.multiOptions || []).map((opt) => {
          const active = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', width: '100%', textAlign: 'left',
                background: active ? '#FFFDF0' : '#F8F5EF',
                border: '1.5px solid ' + (active ? '#E6C200' : '#DDD8CF'),
                marginBottom: '4px', cursor: 'pointer',
              }}
            >
              <div style={{
                width: '16px', height: '16px', flexShrink: 0,
                border: '1.5px solid ' + (active ? '#E6C200' : '#B8B0A0'),
                background: active ? '#FFD94F' : '#FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {active && <span style={{ fontSize: '10px', fontWeight: 700, color: '#1A1A1A' }}>✓</span>}
              </div>
              <span style={{ fontSize: '14px', color: '#1C1C1C', fontWeight: 400 }}>{opt.label}</span>
            </button>
          )
        })}
      </div>
      <button
        onClick={() => selected.length > 0 && onAnswer(selected.join(','), step.next || 'result')}
        style={{
          display: 'block', width: '100%', padding: '14px',
          background: selected.length > 0 ? '#FFD94F' : '#F2EFE9',
          color: selected.length > 0 ? '#1A1A1A' : '#9A9088',
          fontSize: '14px', fontWeight: 700, textAlign: 'center',
          border: 'none', cursor: selected.length > 0 ? 'pointer' : 'default',
        }}
      >
        Continuer →
      </button>
    </div>
  )
}
