'use client'

import { useEffect, useState } from 'react'

import { C, F } from '../theme'
import {
  REGULATORY_LAYERS,
  type RegulatoryLayerKey,
} from '../data/spwLayers'

type Results = Record<RegulatoryLayerKey, boolean | null>

function initialResults(): Results {
  return Object.fromEntries(
    REGULATORY_LAYERS.map((layer) => [layer.key, null])
  ) as Results
}

function DiagnosticSummary({ results }: { results: Results }) {
  const issues = REGULATORY_LAYERS
    .filter((layer) => results[layer.key] === false)
    .map((layer) => layer.label)

  const pending = Object.values(results).some((value) => value === null)
  if (pending) return null

  if (issues.length === 0) {
    return (
      <div style={{ marginTop: '12px', padding: '14px 16px', background: '#F0FAF0', border: '1px solid #A5D6A7', borderLeft: '3px solid #2E7D32' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1B5E20', marginBottom: '4px' }}>
          Bonne nouvelle — aucune contrainte administrative
        </div>
        <div style={{ fontSize: '12px', color: '#2E7D32', lineHeight: 1.6 }}>
          Votre terrain ne présente aucune contrainte réglementaire connue pour la réalisation d’un forage géothermique. Nous pouvons passer à l’analyse du sous-sol.
        </div>
      </div>
    )
  }

  const listed = issues.length === 1
    ? issues[0]
    : issues.slice(0, -1).join(', ') + ' et ' + issues[issues.length - 1]

  return (
    <div style={{ marginTop: '12px', padding: '14px 16px', background: '#FFFDF0', border: '1px solid #F9C84E', borderLeft: '3px solid #E6C200' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#7A5800', marginBottom: '4px' }}>
        Point d’attention — projet toujours réalisable
      </div>
      <div style={{ fontSize: '12px', color: '#8B6914', lineHeight: 1.6 }}>
        Nous avons identifié {issues.length > 1 ? issues.length + ' points d’attention' : 'un point d’attention'} : <strong>{listed}</strong>. Ce{issues.length > 1 ? 's' : ''} élément{issues.length > 1 ? 's' : ''} n’est pas bloquant et notre équipe en tiendra compte pour la suite du projet.
      </div>
    </div>
  )
}

export default function DiagnosticPanel({
  lat,
  lng,
  visibleLayers,
  onToggleLayer,
}: {
  lat: number
  lng: number
  visibleLayers: string[]
  onToggleLayer: (key: string) => void
}) {
  const [results, setResults] = useState<Results>(() => initialResults())

  useEffect(() => {
    setResults(initialResults())

    REGULATORY_LAYERS.forEach(async ({ key }) => {
      try {
        const response = await fetch('/api/geocheck?lat=' + lat + '&lng=' + lng + '&layer=' + key)
        const data = await response.json()

        setResults((prev) => ({
          ...prev,
          [key]: data.hasFeatures === null ? null : !data.hasFeatures,
        }))
      } catch {
        setResults((prev) => ({
          ...prev,
          [key]: null,
        }))
      }
    })
  }, [lat, lng])

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ fontSize: F.xs, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.text4, marginBottom: '8px' }}>
        Diagnostic réglementaire — cliquez pour afficher sur la carte
      </div>

      {REGULATORY_LAYERS.map((layer) => {
        const ok = results[layer.key]
        const isVisible = visibleLayers.includes(layer.key)

        return (
          <button
            key={layer.key}
            onClick={() => onToggleLayer(layer.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              width: '100%',
              textAlign: 'left',
              background: isVisible ? '#FFFDF0' : C.bg,
              border: '1px solid ' + C.border,
              borderLeft: '3px solid ' + (isVisible ? layer.color : C.border),
              marginBottom: '3px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <div style={{ width: '18px', textAlign: 'center', flexShrink: 0, fontSize: '13px', fontWeight: 700 }}>
              {ok === null
                ? <span style={{ color: C.text4, fontSize: F.xs }}>···</span>
                : ok
                  ? <span style={{ color: C.green }}>✓</span>
                  : <span style={{ color: layer.color }}>✗</span>}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: F.sm, fontWeight: 500, color: C.text }}>{layer.label}</div>
              <div style={{ fontSize: '10px', color: C.text4, marginTop: '1px' }}>
                {ok === null ? 'Vérification...' : ok ? layer.ok : layer.ko}
              </div>
            </div>

            <div
              style={{
                flexShrink: 0,
                fontSize: '10px',
                fontWeight: 600,
                color: isVisible ? layer.color : C.text4,
                border: '1px solid ' + (isVisible ? layer.color : C.border),
                padding: '1px 5px',
                lineHeight: '1.5',
              }}
            >
              {isVisible ? 'ON' : 'OFF'}
            </div>
          </button>
        )
      })}

      <DiagnosticSummary results={results} />
    </div>
  )
}
