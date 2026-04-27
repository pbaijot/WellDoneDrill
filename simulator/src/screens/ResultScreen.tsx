'use client'

import type { AddressResult, Answers } from '../types'
import { BackBtn } from '../components/Shared'
import LeadResult from '../components/LeadResult'

export type ResultScreenProps = {
  answers: Answers
  address: AddressResult | null
  lead: string | null
  devisUrl: string
  soumissionUrl: string
  onBack: () => void
}

export default function ResultScreen({
  answers,
  address,
  lead,
  devisUrl,
  soumissionUrl,
  onBack,
}: ResultScreenProps) {
  return (
    <div>
      <BackBtn onBack={onBack} />
      <LeadResult
        answers={answers}
        address={address}
        lead={lead || 'conseiller'}
        devisUrl={devisUrl}
        soumissionUrl={soumissionUrl}
      />
    </div>
  )
}
