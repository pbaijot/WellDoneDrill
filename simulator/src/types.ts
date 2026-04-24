export type Profile = 'part' | 'pro' | null
export type Step = 0 | 1 | 2 | 'address' | 'map' | 'result'

export type SimulatorOption = {
  l: string
  s: string
}

export type SimulatorStep = {
  q: string
  opts: SimulatorOption[]
}

export type AddressResult = {
  label: string
  lat: number
  lng: number
}

export type SimulatorProps = {
  devisUrl: string
  soumissionUrl: string
  onResult?: (profile: Profile, answers: string[], address: AddressResult | null) => void
}
