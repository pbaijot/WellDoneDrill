'use client'
import type { SimulatorProps } from './types'
import { getStep } from './tree'
import { useSimulator } from './hooks/useSimulator'
import SummaryPanel from './components/SummaryPanel'
import RegulatoryMapScreen from './screens/RegulatoryMapScreen'
import DrillingAreaScreen from './screens/DrillingAreaScreen'
import GeologyScreen from './screens/GeologyScreen'
import QuestionsScreen from './screens/QuestionsScreen'
import ProfileScreen from './screens/ProfileScreen'
import AddressScreen from './screens/AddressScreen'
import ResultScreen from './screens/ResultScreen'

export default function Simulator({ devisUrl, soumissionUrl, onResult }: SimulatorProps) {
  const sim = useSimulator()
  const currentStep = getStep(sim.stepId)
  const isFullscreenPhase = sim.phase === 'map' || sim.phase === 'drilling-area'

  return (
    <div style={{ width: '100%', minWidth: 0 }}>

      {sim.phase === 'profile' && (
        <ProfileScreen onChooseProfile={sim.chooseProfile} />
      )}

      {sim.phase === 'address' && (
        <AddressScreen
          onBack={sim.back}
          onConfirm={sim.handleAddressConfirm}
        />
      )}

      {sim.phase === 'map' && sim.address && (
        <RegulatoryMapScreen
          address={sim.address}
          MapComponent={sim.MapComponent}
          visibleLayers={sim.visibleLayers}
          onToggleLayer={sim.toggleLayer}
          onBack={sim.back}
          onConfirm={() => sim.push('geology', '')}
        />
      )}

      {sim.phase === 'geology' && (
        <GeologyScreen
          address={sim.address}
          onBack={sim.back}
          onConfirm={() => sim.push('drilling-area', '')}
        />
      )}

      {sim.phase === 'drilling-area' && (
        <DrillingAreaScreen
          address={sim.address}
          onBack={sim.back}
          onConfirm={() => sim.push('questions', 'type_projet')}
        />
      )}

      {sim.phase === 'questions' && currentStep && (
        <QuestionsScreen
          step={currentStep}
          profile={sim.profile}
          onBack={sim.back}
          onAnswer={sim.handleAnswer}
        />
      )}

      {sim.phase === 'result' && (
        <ResultScreen
          answers={sim.answers}
          address={sim.address}
          lead={sim.lead}
          devisUrl={devisUrl}
          soumissionUrl={soumissionUrl}
          onBack={sim.back}
        />
      )}

      {!isFullscreenPhase && <SummaryPanel profile={sim.profile} address={sim.address} answers={sim.answers} phase={sim.phase} />}
    </div>
  )
}
