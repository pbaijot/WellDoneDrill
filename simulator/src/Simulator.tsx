
'use client'
import type { SimulatorProps } from './types'
import { getStep, SECTION_LABELS } from './tree'
import { useSimulator } from './hooks/useSimulator'
import { C, F } from './theme'
import { T } from './i18n/fr'
import { BackBtn, SectionBadge, PrimaryBtn, SecondaryBtn } from './components/Shared'
import AddressStep from './components/AddressStep'
import DiagnosticPanel from './components/DiagnosticPanel'
import GeologyStep from './components/GeologyStep'
import QuestionStep from './components/QuestionStep'
import InputStep from './components/InputStep'
import MultiChoiceStep from './components/MultiChoiceStep'
import ContactStep from './components/ContactStep'
import LeadResult from './components/LeadResult'
import SummaryPanel from './components/SummaryPanel'

export default function Simulator({ devisUrl, soumissionUrl, onResult }: SimulatorProps) {
  const sim = useSimulator()
  const currentStep = getStep(sim.stepId)

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: F.h2, fontWeight: 700, color: C.text, margin: 0, marginBottom: '4px' }}>
          Mon projet geothermique
        </h2>
        <p style={{ fontSize: F.base, color: C.text3, margin: 0, lineHeight: 1.5 }}>
          Evaluation de faisabilite et pre-dimensionnement PAC en Wallonie.
        </p>
      </div>

      {sim.phase === 'profile' && (
        <div>
          <div style={{ fontSize: F.lg, fontWeight: 600, color: C.text, marginBottom: '8px' }}>{T.profileTitle}</div>
          <div style={{ fontSize: F.base, color: C.text2, lineHeight: 1.6, padding: '10px 14px', borderLeft: '3px solid ' + C.accentDark, background: C.bgSoft, marginBottom: '20px' }}>
            {T.profileIntro}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {(['part', 'pro'] as const).map((p) => (
              <button key={p} onClick={() => sim.chooseProfile(p)}
                style={{ background: C.bgSoft, border: '2px solid ' + C.border, padding: '24px 20px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = C.accentDark; el.style.background = '#FFFDF0' }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = C.border; el.style.background = C.bgSoft }}
              >
                <div style={{ fontSize: F.lg, fontWeight: 600, color: C.text, marginBottom: '6px' }}>
                  {p === 'part' ? T.profilePart : T.profilePro}
                </div>
                <div style={{ fontSize: F.sm, color: C.text4 }}>
                  {p === 'part' ? T.profilePartSub : T.profileProSub}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {sim.phase === 'address' && (
        <div>
          <BackBtn onBack={sim.back} />
          <SectionBadge n={1} label="Localisation" />
          <div style={{ fontSize: F.lg, fontWeight: 600, color: C.text, marginBottom: '8px' }}>{T.addressTitle}</div>
          <div style={{ fontSize: F.base, color: C.text2, lineHeight: 1.6, padding: '10px 14px', borderLeft: '3px solid ' + C.accentDark, background: C.bgSoft, marginBottom: '16px' }}>
            {T.addressIntro}
          </div>
          <AddressStep onConfirm={sim.handleAddressConfirm} />
        </div>
      )}

      {sim.phase === 'map' && sim.address && (
        <div>
          <BackBtn onBack={sim.back} />
          <SectionBadge n={1} label="Verification reglementaire" />
          <div style={{ fontSize: F.lg, fontWeight: 600, color: C.text, marginBottom: '4px' }}>{T.mapTitle}</div>
          <div style={{ fontSize: F.sm, color: C.text4, marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sim.address.label}</div>
          <div style={{ border: '1px solid ' + C.border, overflow: 'hidden', marginBottom: '4px' }}>
            {sim.MapComponent
              ? <sim.MapComponent lat={sim.address.lat} lng={sim.address.lng} activeLayer={sim.activeLayer} />
              : <div style={{ height: '240px', background: C.bgMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: F.base, color: C.text4 }}>{T.mapLoading}</span>
                </div>
            }
          </div>
          <DiagnosticPanel lat={sim.address.lat} lng={sim.address.lng} activeLayer={sim.activeLayer} onLayerClick={sim.setActiveLayer} />
          <div style={{ marginTop: '16px' }}>
            <PrimaryBtn onClick={() => sim.push('geology', '')}>{T.mapConfirm}</PrimaryBtn>
            <SecondaryBtn onClick={sim.back}>{T.mapWrongAddress}</SecondaryBtn>
          </div>
        </div>
      )}

      {sim.phase === 'geology' && (
        <div>
          <BackBtn onBack={sim.back} />
          <SectionBadge n={1} label="Analyse du sous-sol" />
          <GeologyStep onConfirm={() => sim.push('questions', 'type_projet')} />
        </div>
      )}

      {sim.phase === 'questions' && currentStep && (
        <div>
          <BackBtn onBack={sim.back} />
          <SectionBadge n={currentStep.section} label={currentStep.sectionLabel} />
          {currentStep.type === 'input' && <InputStep step={currentStep} onAnswer={sim.handleAnswer} />}
          {currentStep.type === 'multichoice' && <MultiChoiceStep step={currentStep} onAnswer={sim.handleAnswer} />}
          {currentStep.type === 'contact' && <ContactStep onAnswer={sim.handleAnswer} />}
          {(!currentStep.type || currentStep.type === 'choice') && (
            <QuestionStep step={currentStep} profile={sim.profile} stepNum={1} totalSteps={1} onAnswer={sim.handleAnswer} />
          )}
        </div>
      )}

      {sim.phase === 'result' && (
        <div>
          <BackBtn onBack={sim.back} />
          <LeadResult answers={sim.answers} address={sim.address} lead={sim.lead || 'conseiller'} devisUrl={devisUrl} soumissionUrl={soumissionUrl} />
        </div>
      )}

      <SummaryPanel profile={sim.profile} address={sim.address} answers={sim.answers} phase={sim.phase} />
    </div>
  )
}
