'use client'
import { useState } from 'react'
import type { Profile, Answers, AddressResult, SimulatorProps, LeadType } from './types'
import { getStep, SECTION_LABELS, qualifyLead } from './tree'
import AddressStep from './AddressStep'
import DiagnosticPanel from './DiagnosticPanel'
import GeologyStep from './GeologyStep'
import QuestionStep from './QuestionStep'
import InputStep from './InputStep'
import MultiChoiceStep from './MultiChoiceStep'
import ContactStep from './ContactStep'
import LeadResult from './LeadResult'
import SummaryPanel from './SummaryPanel'

type Phase = 'profile' | 'address' | 'map' | 'geology' | 'questions' | 'result'
type HistoryEntry = { phase: Phase; stepId: string; answers: Answers }

export default function Simulator({ devisUrl, soumissionUrl, onResult }: SimulatorProps) {
  const [profile, setProfile] = useState<Profile>(null)
  const [phase, setPhase] = useState<Phase>('profile')
  const [stepId, setStepId] = useState<string>('type_projet')
  const [answers, setAnswers] = useState<Answers>({})
  const [address, setAddress] = useState<AddressResult | null>(null)
  const [activeLayer, setActiveLayer] = useState('captage')
  const [MapComponent, setMapComponent] = useState<any>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [lead, setLead] = useState<LeadType>(null)

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

  function handleAnswer(value: string, next: string) {
    const newAnswers = { ...answers, [stepId]: value }
    setAnswers(newAnswers)
    if (next === 'result') {
      const l = qualifyLead(newAnswers) as LeadType
      setLead(l)
      onResult?.(profile, newAnswers, address, l)
      push('result', '')
    } else {
      push('questions', next)
    }
  }

  const currentStep = getStep(stepId)

  const BackBtn = () => (
    <button onClick={back} className="text-xs text-white/35 hover:text-wdd-yellow mb-4 transition-colors">
      Retour
    </button>
  )

  const SectionBadge = ({ n, label }: { n?: number; label?: string }) => (n || label) ? (
    <div className="flex items-center gap-2 mb-4">
      {n && (
        <div className="w-5 h-5 bg-wdd-yellow flex items-center justify-center flex-shrink-0">
          <span className="text-wdd-black text-xs font-bold">{n}</span>
        </div>
      )}
      <span className="text-xs font-light tracking-widest uppercase text-white/40">
        {label || (n ? SECTION_LABELS[n] : '')}
      </span>
    </div>
  ) : null


  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-1">Mon projet geothermique</h2>
        <p className="text-xs font-light text-white/40 leading-relaxed">
          Evaluation de faisabilite et pre-dimensionnement PAC en Wallonie.
        </p>
      </div>

      {phase === 'profile' && (
        <div>
          <div className="text-sm font-semibold text-white mb-2">Qui etes-vous ?</div>
          <p className="text-xs font-light text-white/35 leading-relaxed mb-5 border-l border-wdd-yellow/30 pl-3">
            Nous commen­çons par localiser votre projet et verifier automatiquement les contraintes reglementaires et le potentiel geothermique du sous-sol.
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
            Nous verifions automatiquement les contraintes reglementaires et analysons le potentiel geothermique.
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
          <GeologyStep onConfirm={() => push('questions', 'type_projet')} />
        </div>
      )}

      {phase === 'questions' && currentStep && (
        <div>
          <BackBtn />
          <SectionBadge n={currentStep.section} label={currentStep.sectionLabel} />
          {currentStep.type === 'input' && (
            <InputStep step={currentStep} onAnswer={handleAnswer} />
          )}
          {currentStep.type === 'multichoice' && (
            <MultiChoiceStep step={currentStep} onAnswer={handleAnswer} />
          )}
          {currentStep.type === 'contact' && (
            <ContactStep onAnswer={handleAnswer} />
          )}
          {(!currentStep.type || currentStep.type === 'choice') && (
            <QuestionStep step={currentStep} profile={profile} stepNum={currentIndex + 1} totalSteps={totalSteps} onAnswer={handleAnswer} />
          )}
        </div>
      )}

      {phase === 'result' && (
        <div>
          <BackBtn />
          <LeadResult answers={answers} address={address} lead={lead || 'conseiller'} devisUrl={devisUrl} soumissionUrl={soumissionUrl} />
        </div>
      )}

      <SummaryPanel profile={profile} address={address} answers={answers} phase={phase} />
    </div>
  )
}
