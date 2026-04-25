'use client'
import type { TreeStep } from './types'

export default function QuestionStep({
  step,
  profile,
  stepNum,
  totalSteps,
  onAnswer,
}: {
  step: TreeStep
  profile: string | null
  stepNum: number
  totalSteps: number
  onAnswer: (value: string, next: string) => void
}) {
  return (
    <div>
      {step.hint && (
        <p className="text-xs font-light text-white/35 leading-relaxed mb-4 border-l border-wdd-yellow/30 pl-3">
          {step.hint}
        </p>
      )}
      <div className="text-sm font-semibold text-white mb-4">{step.question}</div>
      <div className="flex flex-col gap-0.5">
        {step.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onAnswer(opt.value, opt.next)}
            className="bg-white/5 hover:bg-white/10 border-l-2 border-transparent hover:border-wdd-yellow p-3 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-light text-white/80">{opt.label}</div>
              {opt.sublabel && (
                <div className="text-xs font-light text-white/30 mt-0.5">{opt.sublabel}</div>
              )}
            </div>
            <span className="text-wdd-yellow text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-3 flex-shrink-0">
              +
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
