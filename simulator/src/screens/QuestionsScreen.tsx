'use client'

import type { Profile, TreeStep } from '../types'
import { BackBtn, SectionBadge } from '../components/Shared'
import QuestionStep from '../components/QuestionStep'
import InputStep from '../components/InputStep'
import MultiChoiceStep from '../components/MultiChoiceStep'
import ContactStep from '../components/ContactStep'

export type QuestionsScreenProps = {
  step: TreeStep
  profile: Profile
  onBack: () => void
  onAnswer: (stepId: string, value: any) => void
}

export default function QuestionsScreen({
  step,
  profile,
  onBack,
  onAnswer,
}: QuestionsScreenProps) {
  return (
    <div>
      <BackBtn onBack={onBack} />
      <SectionBadge n={step.section} label={step.sectionLabel} />

      {step.type === 'input' && (
        <InputStep step={step} onAnswer={onAnswer} />
      )}

      {step.type === 'multichoice' && (
        <MultiChoiceStep step={step} onAnswer={onAnswer} />
      )}

      {step.type === 'contact' && (
        <ContactStep onAnswer={onAnswer} />
      )}

      {(!step.type || step.type === 'choice') && (
        <QuestionStep
          step={step}
          profile={profile}
          stepNum={1}
          totalSteps={1}
          onAnswer={onAnswer}
        />
      )}
    </div>
  )
}
