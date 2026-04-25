'use client'
import { useState } from 'react'
import type { TreeStep } from './types'

export default function MultiChoiceStep({ step, onAnswer }: {
  step: TreeStep
  onAnswer: (value: string, next: string) => void
}) {
  const [selected, setSelected] = useState<string[]>([])

  function toggle(val: string) {
    if (val === 'aucun' || val === 'inconnu') {
      setSelected([val])
      return
    }
    setSelected((prev) =>
      prev.includes(val)
        ? prev.filter((v) => v !== val)
        : [...prev.filter((v) => v !== 'aucun' && v !== 'inconnu'), val]
    )
  }

  function handleSubmit() {
    if (selected.length === 0) return
    onAnswer(selected.join(','), step.next || 'result')
  }

  return (
    <div>
      {step.hint && (
        <p className="text-xs font-light text-white/35 leading-relaxed mb-4 border-l border-wdd-yellow/30 pl-3">
          {step.hint}
        </p>
      )}
      <div className="text-sm font-semibold text-white mb-4">{step.question}</div>
      <div className="flex flex-col gap-0.5 mb-4">
        {(step.multiOptions || []).map((opt) => {
          const active = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className="flex items-center gap-3 p-3 text-left transition-all"
              style={{
                background: active ? 'rgba(255,217,79,0.08)' : 'rgba(255,255,255,0.03)',
                borderLeft: active ? '2px solid #FFD94F' : '2px solid transparent',
              }}
            >
              <div
                className="w-4 h-4 flex-shrink-0 border flex items-center justify-center"
                style={{ borderColor: active ? '#FFD94F' : 'rgba(255,255,255,0.2)', background: active ? '#FFD94F' : 'transparent' }}
              >
                {active && <span className="text-wdd-black text-xs font-bold">v</span>}
              </div>
              <span className="text-sm font-light text-white/80">{opt.label}</span>
            </button>
          )
        })}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected.length === 0}
        className="block w-full py-3 bg-wdd-yellow text-wdd-black text-sm font-bold text-center disabled:opacity-30 transition-opacity"
      >
        Continuer +
      </button>
    </div>
  )
}
