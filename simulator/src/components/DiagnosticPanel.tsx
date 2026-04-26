'use client'
import { useEffect, useState } from 'react'
import { C, F } from '../theme'

type CheckKey = 'captage' | 'pollution' | 'karst' | 'natura' | 'zi' | 'drigm'


const CHECKS: Array<{ key: CheckKey; label: string; ok: string; ko: string; color: string }> = [
  { key: 'captage',        color: '#C62828', label: 'Prevention de captage',          ok: 'Aucune restriction de captage',          ko: 'Zone de prevention — autorisation requise' },
  { key: 'pollution',      color: '#E65100', label: 'Pollution des sols (BDES)',       ok: 'Aucune pollution recensee',              ko: 'Parcelle BDES — verification avant forage' },
  { key: 'karst',          color: '#B8860B', label: 'Contraintes karstiques',          ok: 'Hors perimetre karstique',              ko: 'Zone karstique — etude geotechnique requise' },
  { key: 'natura',         color: '#2E7D32', label: 'Natura 2000',                    ok: 'Hors perimetre Natura 2000',             ko: 'Zone Natura 2000 — evaluation requise' },
  { key: 'zi',             color: '#1565C0', label: 'Zones inondables (Directive EU)', ok: 'Hors zone inondable reglementaire',     ko: 'Zone inondable — precautions specifiques' },
  { key: 'drigm',          color: '#6A1B9A', label: 'Risques miniers / DRIGM',       ok: 'Hors zone de consultation DRIGM',       ko: 'Zone DRIGM — consultation requise avant forage' },
]


function DiagnosticSummary({ results }: { results: Record<string, boolean | null> }) {
  const issues = Object.entries(results)
    .filter(([_, ok]) => ok === false)
    .map(([key]) => key)

  const pending = Object.values(results).some((v) => v === null)
  if (pending) return null

  const ISSUE_LABELS: Record<string, string> = {
    captage:    'zone de prevention de captage',
    pollution:  'pollution des sols',
    karst:      'contrainte karstique',
    natura:     'perimetre Natura 2000',
    zi:         'zone inondable',
  }

  if (issues.length === 0) {
    return (
      <div style={{ marginTop: '12px', padding: '14px 16px', background: '#F0FAF0', border: '1px solid #A5D6A7', borderLeft: '3px solid #2E7D32' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1B5E20', marginBottom: '4px' }}>
          Bonne nouvelle — aucune contrainte administrative
        </div>
        <div style={{ fontSize: '12px', color: '#2E7D32', lineHeight: 1.6 }}>
          Votre terrain ne presente aucune contrainte reglementaire connue pour la realisation d un forage geothermique. Nous pouvons passer a l analyse du sous-sol.
        </div>
      </div>
    )
  }

  const labels = issues.map((k) => ISSUE_LABELS[k] || k)
  const listed = labels.length === 1
    ? labels[0]
    : labels.slice(0, -1).join(', ') + ' et ' + labels[labels.length - 1]

  return (
    <div style={{ marginTop: '12px', padding: '14px 16px', background: '#FFFDF0', border: '1px solid #F9C84E', borderLeft: '3px solid #E6C200' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#7A5800', marginBottom: '4px' }}>
        Point d attention — projet toujours realisable
      </div>
      <div style={{ fontSize: '12px', color: '#8B6914', lineHeight: 1.6 }}>
        Nous avons identifie {labels.length > 1 ? labels.length + ' points d attention' : 'un point d attention'} : <strong>{listed}</strong>. Ce{labels.length > 1 ? 's' : ''} element{labels.length > 1 ? 's' : ''} n est pas bloquant et notre equipe en tiendra compte pour la suite du projet.
      </div>
    </div>
  )
}

export default function DiagnosticPanel({ lat, lng, visibleLayers, onToggleLayer }: {
  lat: number; lng: number; visibleLayers: string[]; onToggleLayer: (key: string) => void
}) {
  const [results, setResults] = useState<Record<CheckKey, boolean | null>>({
    captage: null,
    pollution: null,
    karst: null,
    natura: null,
    zi: null,
    drigm: null,
  })

  useEffect(() => {
    CHECKS.forEach(async ({ key }) => {
      try {
        const res = await fetch('/api/geocheck?lat=' + lat + '&lng=' + lng + '&layer=' + key)
        const data = await res.json()
        setResults((prev) => ({ ...prev, [key]: data.hasFeatures === null ? null : !data.hasFeatures }))
      } catch {
        setResults((prev) => ({ ...prev, [key]: null }))
      }
    })
  }, [lat, lng])

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ fontSize: F.xs, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.text4, marginBottom: '8px' }}>
        Diagnostic reglementaire — cliquez pour afficher sur la carte
      </div>
      {CHECKS.map((cfg) => {
        const ok = results[cfg.key]
        const isVisible = visibleLayers.includes(cfg.key)
        return (
          <button key={cfg.key} onClick={() => onToggleLayer(cfg.key)} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
            width: '100%', textAlign: 'left',
            background: isVisible ? '#FFFDF0' : C.bg,
            border: '1px solid ' + C.border,
            borderLeft: '3px solid ' + (isVisible ? cfg.color : C.border),
            marginBottom: '3px', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <div style={{ width: '18px', textAlign: 'center', flexShrink: 0, fontSize: '13px', fontWeight: 700 }}>
              {ok === null
                ? <span style={{ color: C.text4, fontSize: F.xs }}>···</span>
                : ok
                ? <span style={{ color: C.green }}>✓</span>
                : <span style={{ color: cfg.color }}>✗</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: F.sm, fontWeight: 500, color: C.text }}>{cfg.label}</div>
              <div style={{ fontSize: '10px', color: C.text4, marginTop: '1px' }}>
                {ok === null ? 'Verification...' : ok ? cfg.ok : cfg.ko}
              </div>
            </div>
            <div style={{ flexShrink: 0, fontSize: '10px', fontWeight: 600, color: isVisible ? cfg.color : C.text4, border: '1px solid ' + (isVisible ? cfg.color : C.border), padding: '1px 5px', lineHeight: '1.5' }}>
              {isVisible ? 'ON' : 'OFF'}
            </div>
          </button>
        )
      })}
      <DiagnosticSummary results={results} />
    </div>
  )
}
