'use client'

import type { Dispatch, SetStateAction } from 'react'

import { PrimaryBtn } from '../Shared'
import type { GeneratedBoreholeLayout, LatLngPoint } from './types'
import { formatArea } from './calculations'
import { S } from './styles'

export type DrawingMode = 'area' | 'entry'

export type DrillingAreaPanelProps = {
  showCadastre: boolean
  setShowCadastre: Dispatch<SetStateAction<boolean>>

  drawingMode: DrawingMode
  setDrawingMode: Dispatch<SetStateAction<DrawingMode>>

  pointCount: number
  areaM2: number
  estimatedBoreholes: number

  requestedBoreholes: number
  setRequestedBoreholes: Dispatch<SetStateAction<number>>

  collectorCount: number
  setCollectorCount: Dispatch<SetStateAction<number>>
  setCollectorOverrides: Dispatch<SetStateAction<Record<string, LatLngPoint>>>

  spacingM: number
  setSpacingM: Dispatch<SetStateAction<number>>
  defaultSpacingM: number

  generatedLayout: GeneratedBoreholeLayout | null
  isCapacityTooLow: boolean

  onUndo: () => void
  onClear: () => void
  onConfirm: () => void
}

const inputStyle = {
  width: '100%',
  border: '1px solid #DDD8CF',
  padding: '10px 12px',
  fontSize: '18px',
  fontWeight: 800,
  fontFamily: 'inherit',
  boxSizing: 'border-box' as const,
}

export default function DrillingAreaPanel({
  showCadastre,
  setShowCadastre,
  drawingMode,
  setDrawingMode,
  pointCount,
  areaM2,
  estimatedBoreholes,
  requestedBoreholes,
  setRequestedBoreholes,
  collectorCount,
  setCollectorCount,
  setCollectorOverrides,
  spacingM,
  setSpacingM,
  defaultSpacingM,
  generatedLayout,
  isCapacityTooLow,
  onUndo,
  onClear,
  onConfirm,
}: DrillingAreaPanelProps) {
  return (
    <>
      <div style={S.panelTitle()}>Implantation des sondes</div>

      <div style={S.metric()}>
        <div style={S.metricLabel()}>Surcouches carte</div>
        <button
          type="button"
          style={{
            ...S.secondaryButton(),
            width: '100%',
            background: showCadastre ? '#FFFDF0' : '#FFFFFF',
            borderColor: showCadastre ? '#E6C200' : '#DDD8CF',
          }}
          onClick={() => setShowCadastre((value) => !value)}
        >
          {showCadastre ? 'Cadastre / bâtiments : ON' : 'Cadastre / bâtiments : OFF'}
        </button>
      </div>

      <div style={S.metric()}>
        <div style={S.metricLabel()}>Mode de dessin</div>
        <div style={{ display: 'grid', gap: '6px' }}>
          <button
            type="button"
            style={{
              ...S.secondaryButton(),
              background: drawingMode === 'area' ? '#FFFDF0' : '#FFFFFF',
              borderColor: drawingMode === 'area' ? '#E6C200' : '#DDD8CF',
            }}
            onClick={() => setDrawingMode('area')}
          >
            1. Tracer la zone de forage
          </button>

          <button
            type="button"
            style={{
              ...S.secondaryButton(),
              background: drawingMode === 'entry' ? '#FFFDF0' : '#FFFFFF',
              borderColor: drawingMode === 'entry' ? '#E6C200' : '#DDD8CF',
            }}
            onClick={() => setDrawingMode('entry')}
            disabled={pointCount < 3}
          >
            2. Placer l’entrée bâtiment
          </button>
        </div>
      </div>

      <div style={S.metric()}>
        <div style={S.metricLabel()}>Surface sélectionnée</div>
        <div style={S.metricValue()}>{formatArea(areaM2)}</div>
      </div>

      <div style={S.metric()}>
        <div style={S.metricLabel()}>Capacité indicative</div>
        <div style={S.metricValue()}>{estimatedBoreholes} sondes</div>
      </div>

      <div style={S.metric()}>
        <div style={S.metricLabel()}>Nombre de sondes à implanter</div>
        <input
          type="number"
          min={1}
          max={99}
          value={requestedBoreholes}
          onChange={(event) => setRequestedBoreholes(Math.max(1, Number(event.target.value || 1)))}
          style={inputStyle}
        />
      </div>

      <div style={S.metric()}>
        <div style={S.metricLabel()}>Nombre de collecteurs</div>
        <input
          type="number"
          min={0}
          max={12}
          step={1}
          value={collectorCount}
          onChange={(event) => {
            const next = Math.max(0, Math.floor(Number(event.target.value || 0)))
            setCollectorCount(next)
            if (next === 0) setCollectorOverrides({})
          }}
          style={inputStyle}
        />
        <div style={{ fontSize: '10px', color: '#9A9088', marginTop: '4px' }}>
          0 = toutes les sondes sont ramenées directement à l’entrée bâtiment.
        </div>
      </div>

      <div style={S.metric()}>
        <div style={S.metricLabel()}>Interdistance entre sondes</div>
        <input
          type="number"
          min={4}
          max={25}
          step={0.5}
          value={spacingM}
          onChange={(event) => setSpacingM(Math.max(4, Number(event.target.value || defaultSpacingM)))}
          style={inputStyle}
        />
        <div style={{ fontSize: '10px', color: '#9A9088', marginTop: '4px' }}>
          Valeur indicative : 8 m. L’implantation est recalculée automatiquement.
        </div>
      </div>

      <div style={S.metric()}>
        <div style={S.metricLabel()}>Schéma généré</div>
        <div style={S.metricValue()}>
          {generatedLayout
            ? generatedLayout.mode === 'collector'
              ? `${collectorCount} collecteur${collectorCount > 1 ? 's' : ''}`
              : 'Direct'
            : '—'}
        </div>
      </div>

      {isCapacityTooLow && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 12px',
            border: '1px solid #E65100',
            borderLeft: '3px solid #E65100',
            background: '#FFF5F2',
            fontSize: '12px',
            lineHeight: 1.5,
            color: '#7A2E00',
          }}
        >
          Attention : le nombre de sondes demandé dépasse la capacité indicative de la zone sélectionnée.
        </div>
      )}

      <div style={S.help()}>
        Si le nombre de collecteurs est à 0, toutes les sondes sont ramenées directement à l’entrée bâtiment. Si un ou plusieurs collecteurs sont ajoutés, les sondes sont regroupées vers ces collecteurs, puis chaque collecteur rejoint l’entrée bâtiment. Les collecteurs peuvent être déplacés manuellement.
      </div>

      <div style={S.buttonRow()}>
        <button type="button" style={S.secondaryButton()} onClick={onUndo}>
          Annuler
        </button>
        <button type="button" style={S.secondaryButton()} onClick={onClear}>
          Effacer
        </button>
      </div>

      <div style={{ marginTop: '16px' }}>
        <PrimaryBtn onClick={onConfirm}>
          Continuer
        </PrimaryBtn>
      </div>
    </>
  )
}
