export type Profile = 'part' | 'pro' | null
export type Step = 0 | 1 | 2 | 3 | 'result'

export type SimulatorOption = {
  l: string
  s: string
}

export type SimulatorStep = {
  q: string
  opts: SimulatorOption[]
}

export type SimulatorProps = {
  /** URL vers la page devis particulier */
  devisUrl: string
  /** URL vers la page soumission pro */
  soumissionUrl: string
  /** Callback optionnel quand l'utilisateur arrive au resultat */
  onResult?: (profile: Profile, answers: string[]) => void
}
