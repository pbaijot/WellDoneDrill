'use client'
import { useState } from 'react'
import type { Profile, Answers, AddressResult, SimulatorProps } from './types'
import { TREE_COMMON_START, TREE_NEUF, TREE_RENOV, TREE_EXTENSION, TREE_COMMON_END, getStep, SECTION_LABELS } from './tree'
import AddressStep from './AddressStep'
import DiagnosticPanel from './DiagnosticPanel'
import GeologyStep from './GeologyStep'
import QuestionStep from './QuestionStep'
import InputStep from './InputStep'
import MultiChoiceStep from './MultiChoiceStep'
import ContactStep from './ContactStep'
import LeadResult from './LeadResult'
import SummaryPanel from './SummaryPanel'
import { qualifyLead } from './tree'

const T = {
  bg: '#FFFFFF',
  bgSoft: '#F8F5EF',
  bgMuted: '#F2EFE9',
  border: '#DDD8CF',
  borderStrong: '#B8B0A0',
  text: '#1C1C1C',
  text2: '#4A4540',
  text3: '#6B6057',
  text4: '#9A9088',
  accent: '#FFD94F',
  accentDark: '#E6C200',
  green: '#2E7D32',
  red: '#C62828',
}

type Phase = 'profile' | 'address' | 'map' | 'geology' | 'questions' | 'result'
type HistoryEntry = { phase: Phase; stepId: string; answers: Answers }

const s = (styles: React.CSSProperties): React.CSSProperties => styles

export default function Simulator({ devisUrl, soumissionUrl, onResult }: SimulatorProps) {
  const [profile, setProfile] = useState<Profile>(null)
  const [phase, setPhase] = useState<Phase>('profile')
  const [stepId, setStepId] = useState<string>('type_projet')
  const [answers, setAnswers] = useState<Answers>({})
  const [address, setAddress] = useState<AddressResult | null>(null)
  const [activeLayer, setActiveLayer] = useState('captage')
  const [MapComponent, setMapComponent] = useState<any>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [lead, setLead] = useState<string>('conseiller')

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
      const l = qualifyLead(newAnswers)
      setLead(l)
      onResult?.(profile, newAnswers, address, l as any)
      push('result', '')
    } else {
      push('questions', next)
    }
  }

  const currentStep = getStep(stepId)

  const Divider = () => <div style={{ height: '1px', background: T.border, margin: '20px 0' }} />

  const BackBtn = () => (
    <button onClick={back} style={s({ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: T.text3, padding: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' })}>
      ← Retour
    </button>
  )

  const SectionBadge = ({ label, n }: { label?: string; n?: number }) => (
    <div style={s({ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' })}>
      {n && (
        <div style={s({ width: '22px', height: '22px', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#1A1A1A', flexShrink: 0 })}>
          {n}
        </div>
      )}
      <span style={s({ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.text4 })}>
        {label || (n ? SECTION_LABELS[n] : '')}
      </span>
    </div>
  )

  return (
    <div>
      {phase === 'profile' && (
        <div>
          <div style={s({ fontSize: '16px', fontWeight: 600, color: T.text, marginBottom: '8px' })}>
            Qui etes-vous ?
          </div>
          <div style={s({ fontSize: '13px', color: T.text3, lineHeight: 1.6, padding: '10px 14px', borderLeft: '3px solid ' + T.accent, background: T.bgSoft, marginBottom: '20px' })}>
            Nous commençons par localiser votre projet et verifier automatiquement les contraintes reglementaires et le potentiel geothermique du sous-sol.
          </div>
          <div style={s({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' })}>
            {(['part', 'pro'] as const).map((p) => (
              <button key={p} onClick={() => chooseProfile(p)} style={s({ background: T.bgSoft, border: '2px solid ' + T.border, padding: '24px 20px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s' })}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.accentDark; (e.currentTarget as HTMLElement).style.background = '#FFFDF0' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.border; (e.currentTarget as HTMLElement).style.background = T.bgSoft }}>
                <div style={s({ fontSize: '15px', fontWeight: 600, color: T.text, marginBottom: '6px' })}>
                  {p === 'part' ? 'Particulier' : 'Professionnel'}
                </div>
                <div style={s({ fontSize: '12px', color: T.text4 })}>
                  {p === 'part' ? 'Maison ou appartement' : 'Entreprise, bureau ou institution'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'address' && (
        <div>
          <BackBtn />
          <SectionBadge n={1} label="Localisation" />
          <div style={s({ fontSize: '15px', fontWeight: 600, color: T.text, marginBottom: '8px' })}>
            Ou se situe votre projet ?
          </div>
          <div style={s({ fontSize: '13px', color: T.text3, lineHeight: 1.6, padding: '10px 14px', borderLeft: '3px solid ' + T.accent, background: T.bgSoft, marginBottom: '16px' })}>
            Nous verifions automatiquement les contraintes reglementaires et analysons le potentiel geothermique.
          </div>
          <AddressStep onConfirm={handleAddressConfirm} />
        </div>
      )}

      {phase === 'map' && address && (
        <div>
          <BackBtn />
          <SectionBadge n={1} label="Verification reglementaire" />
          <div style={s({ fontSize: '15px', fontWeight: 600, color: T.text, marginBottom: '4px' })}>
            Votre chantier se situe ici ?
          </div>
          <div style={s({ fontSize: '12px', color: T.text4, marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>
            {address.label}
          </div>
          <div style={s({ border: '1px solid ' + T.border, overflow: 'hidden', marginBottom: '4px' })}>
            {MapComponent
              ? <MapComponent lat={address.lat} lng={address.lng} activeLayer={activeLayer} />
              : <div style={s({ height: '240px', background: T.bgMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
                  <span style={s({ fontSize: '13px', color: T.text4 })}>Chargement de la carte...</span>
                </div>
            }
          </div>
          <DiagnosticPanel lat={address.lat} lng={address.lng} activeLayer={activeLayer} onLayerClick={setActiveLayer} />
          <div style={s({ marginTop: '16px' })}>
            <button onClick={() => push('geology', '')} style={s({ display: 'block', width: '100%', padding: '14px', background: T.accent, color: '#1A1A1A', fontSize: '14px', fontWeight: 700, textAlign: 'center', border: 'none', cursor: 'pointer', marginBottom: '6px' })}>
              Confirmer — analyser le sous-sol →
            </button>
            <button onClick={back} style={s({ display: 'block', width: '100%', padding: '10px', background: 'none', color: T.text3, fontSize: '12px', textAlign: 'center', border: '1px solid ' + T.border, cursor: 'pointer' })}>
              Ce n est pas la bonne adresse
            </button>
          </div>
        </div>
      )}

      {phase === 'geology' && (
        <div>
          <BackBtn />
          <SectionBadge n={1} label="Analyse du sous-sol" />
          <GeologyStep onConfirm={() => push('questions', 'type_projet')} />
        </div>
      )}

      {phase === 'questions' && currentStep && (
        <div>
          <BackBtn />
          <SectionBadge n={currentStep.section} label={currentStep.sectionLabel} />
          {currentStep.type === 'input' && <InputStep step={currentStep} onAnswer={handleAnswer} />}
          {currentStep.type === 'multichoice' && <MultiChoiceStep step={currentStep} onAnswer={handleAnswer} />}
          {currentStep.type === 'contact' && <ContactStep onAnswer={handleAnswer} />}
          {(!currentStep.type || currentStep.type === 'choice') && (
            <QuestionStep step={currentStep} profile={profile} stepNum={1} totalSteps={1} onAnswer={handleAnswer} />
          )}
        </div>
      )}

      {phase === 'result' && (
        <div>
          <BackBtn />
          <LeadResult answers={answers} address={address} lead={lead} devisUrl={devisUrl} soumissionUrl={soumissionUrl} />
        </div>
      )}

      <SummaryPanel profile={profile} address={address} answers={answers} phase={phase} />
    </div>
  )
}
