export type Profile = 'part' | 'pro' | null

export type StepId =
  | 'profile'
  | 'address'
  | 'map'
  | 'geology'
  | 'dim_choice'
  | 'result_simple'
  | 'result_precis'
  | 'pro_espace'
  | string

export type TreeOption = {
  label: string
  sublabel?: string
  next: StepId
  value: string
}

export type TreeStep = {
  id: string
  question: string
  hint?: string
  options: TreeOption[]
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
