export type Profile = 'part' | 'pro' | null

export type LeadType = 'geothermie' | 'pac_air_eau' | 'conseiller' | 'peu_mature'

export type StepType = 'choice' | 'input' | 'multichoice' | 'contact'

export type TreeOption = {
  label: string
  sublabel?: string
  value: string
  next: string
}

export type TreeStep = {
  id: string
  type?: StepType
  section?: number
  sectionLabel?: string
  question: string
  hint?: string
  options?: TreeOption[]
  inputLabel?: string
  inputUnit?: string
  inputType?: 'text' | 'number'
  next?: string
  multiOptions?: { label: string; value: string }[]
  optional?: boolean
}

export type AddressResult = {
  label: string
  lat: number
  lng: number
}

export type Answers = Record<string, string | string[]>

export type SimulatorProps = {
  devisUrl: string
  soumissionUrl: string
  onResult?: (profile: Profile, answers: Answers, address: AddressResult | null, lead?: LeadType) => void
}
