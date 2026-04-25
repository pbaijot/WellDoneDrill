export type Profile = 'part' | 'pro' | null

export type StepId = string

export type TreeOption = {
  label: string
  sublabel?: string
  value: string
  next: StepId
}

export type TreeStep = {
  id: string
  type?: 'choice' | 'input'
  section?: 1 | 2 | 3 | 4
  question: string
  hint?: string
  inputLabel?: string
  inputUnit?: string
  inputType?: 'text' | 'number'
  next?: StepId
  options?: TreeOption[]
}

export type AddressResult = {
  label: string
  lat: number
  lng: number
}

export type Answers = Record<string, string>

export type SimulatorProps = {
  devisUrl: string
  soumissionUrl: string
  onResult?: (profile: Profile, answers: Answers, address: AddressResult | null) => void
}
