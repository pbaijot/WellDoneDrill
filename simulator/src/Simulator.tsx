'use client'
import { useState } from 'react'
import type { Profile, StepId, Answers, AddressResult, SimulatorProps } from './types'
import { TREE_PART, TREE_PART_PRECIS, TREE_PRO, getStep } from './tree'
import AddressStep from './AddressStep'
import DiagnosticPanel from './DiagnosticPanel'
import GeologyStep from './GeologyStep'
import DimChoice from './DimChoice'
import QuestionStep from './QuestionStep'
import ResultSimple from './ResultSimple'
import ResultPrecis from './ResultPrecis'

type Phase =
  | 'profile'
  | 'tree'
  | 'address'
  | 'map'
  | 'geology'
  | 'dim_choice'
  | 'tree_precis'
  | 'result_simple'
  | 'result_precis'
  | 'pro_espace'

type HistoryEntry = { phase: Phase; stepId?: string; answers: Answers }

export default function Simulator({ devisUrl, soumissionUrl, onResult }: SimulatorProps) {
  const [profile, setProfile] = useState<Profile>(null)
  const [phase, setPhase] = useState<Phase>('profile')
  const [stepId, setStepId] = useState<string>('p_type_projet')
  const [answers, setAnswers] = useState<Answers>({})
  const [address, setAddress] = useState<AddressResult | null>(null)
  const [activeLayer, setActiveLayer] = useState('captage')
  const [MapComponent, setMapComponent] = useState<any>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  function push(p: Phase, sid?: string) {
    setHistory((h) => [...h, { phase, stepId, answers: { ...answers } }])
    setPhase(p)
    if (sid) setStepId(sid)
  }

  function back() {
    const prev = history[history.length - 1]
    if (!prev) return
    setHistory((h) => h.slice(0, -1))
    setPhase(prev.phase)
    if (prev.stepId) setStepId(prev.stepId)
    setAnswers(prev.answers)
  }

  function chooseProfile(p: Profile) {
    setProfile(p)
    if (p === 'part') {
      push('tree', 'p_type_projet')
    } else {
      push('tree', 'pro_role')
    }
    setHistory([])
  }

  function handleAnswer(value: string, next: StepId) {
    const newAnswers = { ...answers, [stepId]: value }
    setAnswers(newAnswers)

    if (next === 'address') { push('address') }
    else if (next === 'dim_choice') { push('dim_choice') }
    else if (next === 'result_simple') { push('result_simple') }
    else if (next === 'result_precis') { push('result_precis') }
    else if (next === 'pro_espace') { push('pro_espace') }
    else { push('tree', next) }
  }

  function handleAddressConfirm(a: AddressResult) {
    setAddress(a)
    import('./LeafletMap').then((mod) => setMapComponent(() => mod.default))
    push('map')
  }

  function handleMapConfirm() {
    push('geology')
  }

  function handleGeologyConfirm() {
    if (profile === 'pro') push('result_precis')
    else push('dim_choice')
  }

  function handleDimChoice(c: 'simple' | 'precis') {
    if (c === 'simple') push('result_simple')
    else push('tree_precis', 'pp_besoin')
  }

  function handlePrecisAnswer(value: string, next: StepId) {
    const newAnswers = { ...answers, [stepId]: value }
    setAnswers(newAnswers)
    if (next === 'result_precis') push('result_precis')
    else push('tree_precis', next)
  }

  const currentTree = phase === 'tree'
    ? (profile === 'pro' ? TREE_PRO : TREE_PART)
    : TREE_PART_PRECIS

  const currentStep = getStep(stepId)

  const allSteps = profile === 'pro' ? TREE_PRO : TREE_PART
  const precisSteps = TREE_PART_PRECIS
  const totalPart = TREE_PART.length + 3
  const totalPrecis = TREE_PART_PRECIS.length

  function progressBar(current: number, total: number) {
    return (
      <div className="flex gap-0.5 mb-5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-0.5 flex-1 transition-all"
            style={{ background: i < current ? '#FFD94F' : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>
    )
  }

  function stepLabel() {
    const profileLabel = profile === 'part' ? 'Particulier' : 'Professionnel'
    const stepIndex = allSteps.findIndex((s) => s.id === stepId) + 1
    return profileLabel + ' - Etape ' + stepIndex + ' / ' + allSteps.length
  }

  const BackBtn = () => (
    <button
      onClick={back}
      className="text-xs text-white/35 hover:text-wdd-yellow mb-4 transition-colors"
    >
      Retour
    </button>
  )

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-1">Mon projet geothermique</h2>
        <p className="text-xs font-light text-white/40 leading-relaxed">
          Evaluation de faisabilite geothermique en Wallonie.
        </p>
      </div>

      {phase === 'profile' && (
        <div>
          <div className="text-sm font-semibold text-white mb-4">Qui etes-vous ?</div>
          <div className="grid grid-cols-2 gap-1">
            {(['part', 'pro'] as const).map((p) => (
              <button
                key={p}
                onClick={() => chooseProfile(p)}
                className="bg-white/5 border-2 border-transparent hover:border-wdd-yellow p-6 text-left transition-all group"
              >
                <div className="text-sm font-semibold text-white mb-1">
                  {p === 'part' ? 'Particulier' : 'Professionnel'}
                </div>
                <div className="text-xs font-light text-white/35">
                  {p === 'part' ? 'Maison ou appartement' : 'Entreprise, bureau ou institution'}
                </div>
                <div className="text-wdd-yellow text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Commencer +
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'tree' && currentStep && (
        <div>
          <BackBtn />
          {progressBar(
            allSteps.findIndex((s) => s.id === stepId) + 1,
            allSteps.length + 3
          )}
          <div className="text-xs font-light tracking-widest uppercase text-wdd-yellow mb-2">
            {stepLabel()}
          </div>
          <QuestionStep
            step={currentStep}
            profile={profile}
            stepNum={allSteps.findIndex((s) => s.id === stepId) + 1}
            totalSteps={allSteps.length}
            onAnswer={handleAnswer}
          />
        </div>
      )}

      {phase === 'address' && (
        <div>
          <BackBtn />
          <div className="text-xs font-light tracking-widest uppercase text-wdd-yellow mb-2">
            Localisation
          </div>
          <AddressStep onConfirm={handleAddressConfirm} />
        </div>
      )}

      {phase === 'map' && address && (
        <div>
          <BackBtn />
          <div className="text-xs font-light tracking-widest uppercase text-wdd-yellow mb-2">
            Verification reglementaire
          </div>
          <div className="text-sm font-semibold text-white mb-1">
            Votre chantier se situe ici ?
          </div>
          <div className="text-xs text-white/40 mb-3 truncate">{address.label}</div>
          <div className="border border-white/10 overflow-hidden mb-1">
            {MapComponent ? (
              <MapComponent lat={address.lat} lng={address.lng} activeLayer={activeLayer} />
            ) : (
              <div className="h-64 bg-white/5 flex items-center justify-center">
                <span className="text-xs text-white/30">Chargement...</span>
              </div>
            )}
          </div>
          <DiagnosticPanel
            lat={address.lat}
            lng={address.lng}
            activeLayer={activeLayer}
            onLayerClick={setActiveLayer}
          />
          <div className="mt-4">
            <button
              onClick={handleMapConfirm}
              className="block w-full py-3 bg-wdd-yellow text-wdd-black text-sm font-bold text-center hover:bg-wdd-yellow/90 transition-colors"
            >
              Confirmer cette adresse
            </button>
            <button
              onClick={back}
              className="block w-full py-2 mt-0.5 text-xs text-white/30 text-center hover:text-white/60 transition-colors"
            >
              Ce n est pas la bonne adresse
            </button>
          </div>
        </div>
      )}

      {phase === 'geology' && (
        <div>
          <BackBtn />
          <GeologyStep onConfirm={handleGeologyConfirm} />
        </div>
      )}

      {phase === 'dim_choice' && (
        <div>
          <BackBtn />
          <DimChoice onChoice={handleDimChoice} />
        </div>
      )}

      {phase === 'tree_precis' && currentStep && (
        <div>
          <BackBtn />
          {progressBar(
            precisSteps.findIndex((s) => s.id === stepId) + 1,
            precisSteps.length
          )}
          <div className="text-xs font-light tracking-widest uppercase text-wdd-yellow mb-2">
            Dimensionnement precis - Etape {precisSteps.findIndex((s) => s.id === stepId) + 1} / {precisSteps.length}
          </div>
          <QuestionStep
            step={currentStep}
            profile={profile}
            stepNum={precisSteps.findIndex((s) => s.id === stepId) + 1}
            totalSteps={precisSteps.length}
            onAnswer={handlePrecisAnswer}
          />
        </div>
      )}

      {phase === 'result_simple' && (
        <div>
          <BackBtn />
          <ResultSimple
            answers={answers}
            devisUrl={devisUrl}
            onPrecis={() => push('dim_choice')}
          />
        </div>
      )}

      {phase === 'result_precis' && (
        <div>
          <BackBtn />
          <ResultPrecis
            answers={answers}
            address={address}
            profile={profile}
            devisUrl={devisUrl}
            soumissionUrl={soumissionUrl}
          />
        </div>
      )}

      {phase === 'pro_espace' && (
        <div>
          <BackBtn />
          <div className="border-t-2 border-wdd-yellow bg-white/5 p-5">
            <div className="text-sm font-bold text-wdd-yellow mb-2">
              Espace professionnel
            </div>
            <div className="text-xs font-light text-white/50 leading-relaxed mb-5">
              Deposez votre projet, vos plans et specifications. Notre equipe vous retourne une offre detaillee sous 48h ouvrables.
            </div>
            
              href={soumissionUrl}
              className="block w-full py-3 bg-wdd-yellow text-wdd-black text-sm font-bold text-center"
            >
              Acceder a l espace soumission +
            </a>
            
              href="tel:+32494142449"
              className="block w-full py-2.5 mt-1 border border-white/10 text-white/40 text-xs text-center"
            >
              Parler a un expert : +32 494 14 24 49
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
