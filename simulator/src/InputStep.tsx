'use client'
import { useState } from 'react'
import type { TreeStep } from './types'

export default function InputStep({
  step,
  onAnswer,
}: {
  step: TreeStep
  onAnswer: (value: string, next: string) => void
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!value.trim()) {
      setError('Veuillez renseigner ce champ.')
      return
    }
    if (step.inputType === 'number' && isNaN(Number(value))) {
      setError('Veuillez entrer un nombre valide.')
      return
    }
    onAnswer(value.trim(), step.next || 'result_precis')
  }

  return (
    <div>
      {step.hint && (
        <p className="text-xs font-light text-white/35 leading-relaxed mb-4 border-l border-wdd-yellow/30 pl-3">
          {step.hint}
        </p>
      )}
      <div className="text-sm font-semibold text-white mb-4">{step.question}</div>
      <div className="flex gap-2 items-stretch">
        <input
          type={step.inputType || 'text'}
          value={value}
          onChange={(e) => { setValue(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={step.inputLabel || ''}
          className="flex-1 bg-white/5 border border-white/20 text-white text-sm font-light px-4 py-3 outline-none focus:border-wdd-yellow placeholder-white/20 transition-colors"
          autoComplete="off"
        />
        {step.inputUnit && (
          <div className="flex items-center px-3 bg-white/5 border border-white/10 text-white/30 text-xs flex-shrink-0">
            {step.inputUnit}
          </div>
        )}
      </div>
      {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
      <button
        onClick={handleSubmit}
        className="mt-3 w-full py-3 bg-wdd-yellow text-wdd-black text-sm font-bold text-center hover:bg-wdd-yellow/90 transition-colors"
      >
        Continuer +
      </button>
      <button
        onClick={() => onAnswer('', step.next || 'result_precis')}
        className="mt-1 w-full py-2 text-xs text-white/25 text-center hover:text-white/50 transition-colors"
      >
        Passer cette etape
      </button>
    </div>
  )
}
