
'use client'
import type { TreeStep } from '../types'
import { C, F } from '../theme'
import { Hint, QTitle } from './Shared'

export default function QuestionStep({ step, onAnswer }: {
  step: TreeStep
  profile: string | null
  stepNum: number
  totalSteps: number
  onAnswer: (value: string, next: string) => void
}) {
  return (
    <div>
      {step.hint && <Hint>{step.hint}</Hint>}
      <QTitle>{step.question}</QTitle>
      <div>
        {(step.options || []).map((opt) => (
          <button
            key={opt.value}
            onClick={() => onAnswer(opt.value, opt.next)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '13px 16px', background: C.bgSoft, border: '1.5px solid ' + C.border, marginBottom: '4px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = C.accentDark; el.style.background = '#FFFDF0' }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = C.border; el.style.background = C.bgSoft }}
          >
            <div>
              <div style={{ fontSize: F.md, fontWeight: 500, color: C.text }}>{opt.label}</div>
              {opt.sublabel && <div style={{ fontSize: F.sm, color: C.text4, marginTop: '2px' }}>{opt.sublabel}</div>}
            </div>
            <span style={{ fontSize: '18px', color: C.accentDark, marginLeft: '12px', flexShrink: 0 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
