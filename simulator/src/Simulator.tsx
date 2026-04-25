'use client'
import { useState } from 'react'
import type { Profile, StepId, Answers, AddressResult, SimulatorProps } from './types'
import { TREE_PART_RAPIDE, TREE_PART_PRECIS, TREE_PRO, getStep, SECTION_LABELS } from './tree'
import AddressStep from './AddressStep'
import DiagnosticPanel from './DiagnosticPanel'
import GeologyStep from './GeologyStep'
import DimChoice from './DimChoice'
import QuestionStep from './QuestionStep'
import InputStep from './InputStep'
import ResultSimple from './ResultSimple'
import ResultPrecis from './ResultPrecis'

type Phase =
  | 'profile'
  | 'address'
  | 'map'
  | 'geology'
  | 'dim_choice'
  | 'questions'
  | 'result_simple'
  | 'result_precis'
  | 'pro_espace'

type HistoryEntry = { phase: Phase; stepId: string; answers: Answers }

export default function Simulator({ devisUrl, soumissionUrl, onResult }: SimulatorProps) {
  const [profile, setProfile] = useState<Profile>(null)
  const [phase, setPhase] = useState<Phase>('profile')
  const [stepId, setStepId] = useState<string>('')
  const [answers, setAnswers] = useState<Answers>({})
  const [address, setAddress] = useState<AddressResult | null>(null)
  const [activeLayer, setActiveLayer] = useState('captage')
  const [MapComponent, setMapComponent] = useState<any>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [dim, setDim] = useState<'simple' | 'precis' | null>(null)

  function push(p: Phase, sid?: string) {
    setHistory((h) => [...h, { phase, stepId, answers: { ...answers } }])
    setPhase(p)
    if (sid !== undefined) setStepId(sid)
  }

  function back() {
    const prev = history[history.length - 1]
    if (!prev) return
    setHistory((h) => h.slice(0, -1))
    setPhase(prev.phase)
    setStepId(prev.stepId)
    setAnswers(prev.answers)
  }

  function chooseProfile(p: Profile) {
    setProfile(p)
    setHistory([])
    setAnswers({})
    push('address', '')
  }

  function handleAddressConfirm(a: AddressResult) {
    setAddress(a)
    import('./LeafletMap').then((mod) => setMapComponent(() => mod.default))
    push('map', '')
  }

  function handleDimChoice(c: 'simple' | 'precis') {
    setDim(c)
    if (c === 'simple') push('questions', 'r_type_bien')
    else push('questions', 'pp_type_projet')
  }

  function handleAnswer(value: string, next: StepId) {
    const newAnswers = { ...answers, [stepId]: value }
    setAnswers(newAnswers)
    if (next === 'result_simple') push('result_simple', '')
    else if (next === 'result_precis') { onResult?.(profile, newAnswers, address); push('result_precis', '') }
    else if (next === 'pro_espace') push('pro_espace', '')
    else push('questions', next)
  }

  const currentStep = getStep(stepId)
  const currentSection = currentStep?.section

  const BackBtn = () => (
    <button onClick={back} className="text-xs text-white/35 hover:text-wdd-yellow mb-4 transition-colors">
      Retour
    </button>
  )

  const SectionBadge = ({ n }: { n?: number }) => n ? (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-5 h-5 bg-wdd-yellow flex items-center justify-center flex-shrink-0">
        <span className="text-wdd-black text-xs font-bold">{n}</span>
      </div>
      <span className="text-xs font-light tracking-widest uppercase text-white/40">
        {SECTION_LABELS[n]}
      </span>
    </div>
  ) : null

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
          <div className="text-sm font-semibold text-white mb-2">Qui etes-vous ?</div>
          <p className="text-xs font-light text-white/35 leading-relaxed mb-5 border-l border-wdd-yellow/30 pl-3">
            Nous commençons par localiser votre projet et verifier automatiquement les contraintes reglementaires et le potentiel geothermique du sous-sol.
          </p>
          <div className="grid grid-cols-2 gap-1">
            {(['part', 'pro'] as const).map((p) => (
              <button key={p} onClick={() => chooseProfile(p)} className="bg-white/5 border-2 border-transparent hover:border-wdd-yellow p-6 text-left transition-all group">
                <div className="text-sm font-semibold text-white mb-1">{p === 'part' ? 'Particulier' : 'Professionnel'}</div>
                <div className="text-xs font-light text-white/35 mb-3">{p === 'part' ? 'Maison ou appartement' : 'Entreprise, bureau ou institution'}</div>
                <div className="text-wdd-yellow text-xs opacity-0 group-hover:opacity-100 transition-opacity">Commencer +</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'address' && (
        <div>
          <BackBtn />
          <SectionBadge n={1} />
          <div className="text-sm font-semibold text-white mb-1">Ou se situe votre projet ?</div>
          <p className="text-xs font-light text-white/35 leading-relaxed mb-4">
            Nous verifions automatiquement les contraintes reglementaires et analysons le potentiel geothermique de votre zone.
          </p>
          <AddressStep onConfirm={handleAddressConfirm} />
        </div>
      )}

      {phase === 'map' && address && (
        <div>
          <BackBtn />
          <SectionBadge n={1} />
          <div className="text-sm font-semibold text-white mb-1">Votre chantier se situe ici ?</div>
          <div className="text-xs text-white/40 mb-3 truncate">{address.label}</div>
          <div className="border border-white/10 overflow-hidden mb-1">
            {MapComponent
              ? <MapComponent lat={address.lat} lng={address.lng} activeLayer={activeLayer} />
              : <div className="h-64 bg-white/5 flex items-center justify-center"><span className="text-xs text-white/30">Chargement...</span></div>
            }
          </div>
          <DiagnosticPanel lat={address.lat} lng={address.lng} activeLayer={activeLayer} onLayerClick={setActiveLayer} />
          <div className="mt-4">
            <button onClick={() => push('geology', '')} className="block w-full py-3 bg-wdd-yellow text-wdd-black text-sm font-bold text-center hover:bg-wdd-yellow/90 transition-colors">
              Confirmer — analyser le sous-sol
            </button>
            <button onClick={back} className="block w-full py-2 mt-0.5 text-xs text-white/30 text-center hover:text-white/50 transition-colors">
              Ce n est pas la bonne adresse
            </button>
          </div>
        </div>
      )}

      {phase === 'geology' && (
        <div>
          <BackBtn />
          <SectionBadge n={1} />
          <GeologyStep onConfirm={() => {
            if (profile === 'pro') push('questions', 'pro_role')
            else push('dim_choice', '')
          }} />
        </div>
      )}

      {phase === 'dim_choice' && (
        <div>
          <BackBtn />
          <SectionBadge n={2} />
          <DimChoice onChoice={handleDimChoice} />
        </div>
      )}

      {phase === 'questions' && currentStep && (
        <div>
          <BackBtn />
          <SectionBadge n={currentSection} />
          {currentStep.type === 'input'
            ? <InputStep step={currentStep} onAnswer={handleAnswer} />
            : <QuestionStep step={currentStep} profile={profile} stepNum={1} totalSteps={1} onAnswer={handleAnswer} />
          }
        </div>
      )}

      {phase === 'result_simple' && (
        <div>
          <BackBtn />
          <ResultSimple answers={answers} devisUrl={devisUrl} onPrecis={() => {
            setDim('precis')
            push('questions', 'pp_type_projet')
          }} />
        </div>
      )}

      {phase === 'result_precis' && (
        <div>
          <BackBtn />
          <ResultPrecis answers={answers} address={address} profile={profile} devisUrl={devisUrl} soumissionUrl={soumissionUrl} />
        </div>
      )}

      {phase === 'pro_espace' && (
        <div>
          <BackBtn />
          <div className="border-t-2 border-wdd-yellow bg-white/5 p-5">
            <div className="text-sm font-bold text-wdd-yellow mb-2">Espace professionnel</div>
            <div className="text-xs font-light text-white/50 leading-relaxed mb-5">
              Deposez votre projet, vos plans et specifications. Notre equipe vous retourne une offre detaillee sous 48h ouvrables.
            </div>
            <a href={soumissionUrl} className="block w-full py-3 bg-wdd-yellow text-wdd-black text-sm font-bold text-center mb-1">
              Acceder a l espace soumission +
            </a>
            <a href="tel:+32494142449" className="block w-full py-2.5 border border-white/10 text-white/40 text-xs text-center">
              Parler a un expert : +32 494 14 24 49
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
