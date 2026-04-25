'use client'
import type { TreeStep } from './types'

export default function QuestionStep({ step, onAnswer }: {
  step: TreeStep
  profile: string | null
  stepNum: number
  totalSteps: number
  onAnswer: (value: string, next: string) => void
}) {
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
      <div>
        {(step.options || []).map((opt) => (
          <button
            key={opt.value}
            onClick={() => onAnswer(opt.value, opt.next)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '14px 16px', background: '#F8F5EF', border: '1.5px solid #DDD8CF', marginBottom: '4px', cursor: 'pointer', textAlign: 'left' }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#E6C200'; el.style.background = '#FFFDF0' }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#DDD8CF'; el.style.background = '#F8F5EF' }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#1C1C1C' }}>{opt.label}</div>
              {opt.sublabel && (
                <div style={{ fontSize: '12px', color: '#9A9088', marginTop: '2px' }}>{opt.sublabel}</div>
              )}
            </div>
            <span style={{ fontSize: '18px', color: '#E6C200', marginLeft: '12px', flexShrink: 0 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
