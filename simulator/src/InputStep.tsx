'use client'
import { useState } from 'react'
import type { TreeStep } from './types'

export default function InputStep({ step, onAnswer }: {
  step: TreeStep
  onAnswer: (value: string, next: string) => void
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!value.trim() && !step.optional) { setError('Veuillez renseigner ce champ.'); return }
    if (step.inputType === 'number' && value && isNaN(Number(value))) { setError('Valeur numerique requise.'); return }
    onAnswer(value.trim(), step.next || 'result')
  }

  const inputStyle: React.CSSProperties = {
    flex: 1, border: '1.5px solid ' + (error ? '#C62828' : '#DDD8CF'),
    background: '#FFFFFF', color: '#1C1C1C', fontSize: '14px',
    padding: '12px 14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
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
      <div style={{ display: 'flex', marginBottom: '12px' }}>
        <input
          type={step.inputType || 'text'}
          value={value}
          onChange={(e) => { setValue(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#E6C200')}
          onBlur={(e) => (e.currentTarget.style.borderColor = error ? '#C62828' : '#DDD8CF')}
          placeholder={step.inputLabel || ''}
          style={inputStyle}
          autoComplete="off"
        />
        {step.inputUnit && (
          <div style={{ background: '#F2EFE9', border: '1.5px solid #DDD8CF', borderLeft: 'none', padding: '12px 14px', fontSize: '13px', color: '#6B6057', flexShrink: 0 }}>
            {step.inputUnit}
          </div>
        )}
      </div>
      {error && <div style={{ fontSize: '12px', color: '#C62828', marginBottom: '8px' }}>{error}</div>}
      <button
        onClick={handleSubmit}
        style={{ display: 'block', width: '100%', padding: '14px', background: '#FFD94F', color: '#1A1A1A', fontSize: '14px', fontWeight: 700, textAlign: 'center', border: 'none', cursor: 'pointer', marginBottom: '6px' }}
      >
        Continuer →
      </button>
      {step.optional && (
        <button
          onClick={() => onAnswer('', step.next || 'result')}
          style={{ display: 'block', width: '100%', padding: '10px', background: 'none', color: '#9A9088', fontSize: '13px', textAlign: 'center', border: '1px solid #DDD8CF', cursor: 'pointer' }}
        >
          Passer cette etape
        </button>
      )}
    </div>
  )
}
