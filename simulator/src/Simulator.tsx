'use client'
import type React from 'react'
import type { SimulatorProps } from './types'
import { getStep, SECTION_LABELS } from './tree'
import { useSimulator } from './hooks/useSimulator'
import { C, F } from './theme'
import { T } from './i18n/fr'
import { BackBtn, SectionBadge, PrimaryBtn, SecondaryBtn } from './components/Shared'
import AddressStep from './components/AddressStep'
import DiagnosticPanel from './components/DiagnosticPanel'
import GeologyStep from './components/GeologyStep'
import DrillingAreaStep from './components/DrillingAreaStep'
import QuestionStep from './components/QuestionStep'
import InputStep from './components/InputStep'
import MultiChoiceStep from './components/MultiChoiceStep'
import ContactStep from './components/ContactStep'
import LeadResult from './components/LeadResult'
import SummaryPanel from './components/SummaryPanel'

export default function Simulator({ devisUrl, soumissionUrl, onResult }: SimulatorProps) {
  const sim = useSimulator()
  const currentStep = getStep(sim.stepId)
  const isFullscreenPhase = sim.phase === 'map' || sim.phase === 'drilling-area'

  const fullscreenShell: React.CSSProperties = {
    width: '100vw',
    minHeight: '100vh',
    background: '#F2EFE9',
  }

  const standardShell: React.CSSProperties = {
    width: '100%',
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '32px clamp(16px, 2vw, 32px) 72px',
    boxSizing: 'border-box',
  }


  return (
    <div style={{ width: '100%', minWidth: 0 }}>
      {!isFullscreenPhase && <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: F.h2, fontWeight: 700, color: C.text, margin: 0, marginBottom: '4px' }}>
          Mon projet geothermique
        </h2>
        <p style={{ fontSize: F.base, color: C.text3, margin: 0, lineHeight: 1.5 }}>
          Evaluation de faisabilite et pre-dimensionnement PAC en Wallonie.
        </p>
      </div>}

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
        <div style={{ position: 'fixed', left: 0, right: 0, top: '42px', bottom: 0, width: '100vw', height: `calc(100dvh - 42px)`, overflow: 'hidden', background: C.bgMuted, zIndex: 20 }}>
          <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {sim.MapComponent
              ? <sim.MapComponent lat={sim.address.lat} lng={sim.address.lng} visibleLayers={sim.visibleLayers} />
              : <div style={{ height: '100%', background: C.bgMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: F.base, color: C.text4 }}>{T.mapLoading}</span>
                </div>
            }
          </div>

          <div style={{
            position: 'absolute',
            left: '56px',
            top: '30px',
            zIndex: 700,
            display: 'grid',
            gap: '10px',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.94)',
              border: '1px solid ' + C.border,
              padding: '10px 12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}>
              <BackBtn onBack={sim.back} />
              <SectionBadge n={1} label="Verification reglementaire" />
              <div style={{ fontSize: F.lg, fontWeight: 600, color: C.text, marginTop: '8px', marginBottom: '4px' }}>{T.mapTitle}</div>
              <div style={{ fontSize: F.sm, color: C.text4, maxWidth: '520px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sim.address.label}</div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            right: '18px',
            top: '30px',
            bottom: '18px',
            width: '340px',
            overflowY: 'auto',
            zIndex: 710,
            border: '1px solid ' + C.border,
            background: 'rgba(255,255,255,0.96)',
            padding: '14px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.16)',
          }}>
            <DiagnosticPanel
              lat={sim.address.lat}
              lng={sim.address.lng}
              visibleLayers={sim.visibleLayers}
              onToggleLayer={sim.toggleLayer}
            />

            <div style={{ marginTop: '16px', display: 'grid', gap: '8px' }}>
              <PrimaryBtn onClick={() => sim.push('geology', '')}>{T.mapConfirm}</PrimaryBtn>
              <SecondaryBtn onClick={sim.back}>{T.mapWrongAddress}</SecondaryBtn>
            </div>
          </div>
        </div>
      )}

      {sim.phase === 'geology' && (
        <div>
          <BackBtn onBack={sim.back} />
          <SectionBadge n={1} label="Analyse du sous-sol" />
          <GeologyStep address={sim.address} onConfirm={() => sim.push('drilling-area', '')} />
        </div>
      )}


      {sim.phase === 'drilling-area' && (
        <div style={{ position: 'relative', width: '100vw', height: '100dvh', minHeight: '100dvh', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: '18px', top: '18px', zIndex: 720, background: 'rgba(255,255,255,0.94)', border: '1px solid ' + C.border, padding: '10px 12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
            <BackBtn onBack={sim.back} />
            <SectionBadge n={1} label="Zone de forage disponible" />
          </div>
          <DrillingAreaStep
            address={sim.address}
            onConfirm={() => sim.push('questions', 'type_projet')}
          />
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
