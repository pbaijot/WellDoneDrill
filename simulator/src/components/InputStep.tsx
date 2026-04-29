
'use client'
import { useState } from 'react'
import type { TreeStep } from '../types'
import { C, F, input } from '../theme'
import { T } from '../i18n/fr'
import { Hint, QTitle, PrimaryBtn, SecondaryBtn } from './Shared'

export default function InputStep({ step, onAnswer }: {
  step: TreeStep
  onAnswer: (value: string, next: string) => void
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!value.trim() && !step.optional) { setError(T.contactRequired + '.'); return }
    if (step.inputType === 'number' && value && isNaN(Number(value))) { setError('Valeur numerique requise.'); return }
    onAnswer(value.trim(), step.next || 'result')
  }

  return (
    <div>
      {step.hint && <Hint>{step.hint}</Hint>}
      <QTitle>{step.question}</QTitle>
      <div style={{ display: 'flex', marginBottom: '12px' }}>
        <input
          type={step.inputType || 'text'}
          value={value}
          onChange={(e) => { setValue(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          onFocus={(e) => (e.currentTarget.style.borderColor = C.accentDark)}
          onBlur={(e) => (e.currentTarget.style.borderColor = error ? C.red : C.border)}
          placeholder={step.inputLabel || ''}
          style={input(!!error)}
          autoComplete="off"
        />
        {step.inputUnit && (
          <div style={{ background: C.bgMuted, border: '1.5px solid ' + C.border, borderLeft: 'none', padding: '11px 13px', fontSize: F.base, color: C.text3, flexShrink: 0 }}>
            {step.inputUnit}
          </div>
        )}
      </div>
      {error && <div style={{ fontSize: F.sm, color: C.red, marginBottom: '8px' }}>{error}</div>}
      <PrimaryBtn onClick={handleSubmit}>{T.continue}</PrimaryBtn>
      {step.optional && <SecondaryBtn onClick={() => onAnswer('', step.next || 'result')}>{T.skip}</SecondaryBtn>}
    </div>
  )
}
