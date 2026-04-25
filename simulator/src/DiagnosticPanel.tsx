'use client'
import { useEffect, useState } from 'react'

type Result = { key: string; label: string; ok: boolean | null; detail: string; detailKo: string; color: string }

const CHECKS: Result[] = [
  { key: 'captage', label: 'Zone de prevention de captage', ok: null, detail: 'Aucune restriction de captage detectee', detailKo: 'Zone de prevention — forage soumis a autorisation', color: '#C62828' },
  { key: 'pollution', label: 'Pollution des sols (BDES)', ok: null, detail: 'Aucune pollution recensee sur cette parcelle', detailKo: 'Parcelle recensee dans la BDES — verification recommandee', color: '#E65100' },
  { key: 'karst', label: 'Contraintes karstiques', ok: null, detail: 'Hors perimetre de contrainte karstique', detailKo: 'Zone karstique — etude geotechnique obligatoire', color: '#B8860B' },
  { key: 'natura', label: 'Natura 2000', ok: null, detail: 'Hors perimetre Natura 2000', detailKo: 'Zone Natura 2000 — evaluation des incidences requise', color: '#2E7D32' },
  { key: 'inondations', label: 'Zone inondable', ok: null, detail: 'Parcelle hors zone inondable', detailKo: 'Zone inondable — precautions specifiques requises', color: '#1565C0' },
]

export default function DiagnosticPanel({ lat, lng, activeLayer, onLayerClick }: {
  lat: number; lng: number; activeLayer: string; onLayerClick: (k: string) => void
}) {
  const [results, setResults] = useState<Result[]>(CHECKS.map((c) => ({ ...c })))

  useEffect(() => {
    const updated: Result[] = CHECKS.map((c) => ({ ...c, ok: null }))
    setResults([...updated])
    Promise.all(CHECKS.map(async (check, i) => {
      try {
        const res = await fetch('/api/geocheck?lat=' + lat + '&lng=' + lng + '&layer=' + check.key)
        const data = await res.json()
        const okValue: boolean | null = data.hasFeatures === null ? null : !data.hasFeatures
        updated[i] = { ...check, ok: okValue }
      } catch { updated[i] = { ...check, ok: null } }
      setResults([...updated])
    }))
  }, [lat, lng])

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9088', marginBottom: '8px' }}>
        Diagnostic reglementaire — cliquez pour visualiser
      </div>
      {results.map((r) => (
        <button
          key={r.key}
          onClick={() => onLayerClick(r.key)}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '11px 14px', width: '100%', textAlign: 'left',
            background: activeLayer === r.key ? '#FFFDF0' : '#FFFFFF',
            border: '1px solid #DDD8CF',
            borderLeft: '3px solid ' + (activeLayer === r.key ? r.color : '#DDD8CF'),
            marginBottom: '4px', cursor: 'pointer',
          }}
        >
          <div style={{ width: '20px', textAlign: 'center', flexShrink: 0, fontSize: '14px', fontWeight: 700 }}>
            {r.ok === null
              ? <span style={{ color: '#9A9088', fontSize: '11px' }}>···</span>
              : r.ok
              ? <span style={{ color: '#2E7D32' }}>✓</span>
              : <span style={{ color: r.color }}>✗</span>
            }
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#1C1C1C' }}>{r.label}</div>
            <div style={{ fontSize: '11px', color: '#9A9088', marginTop: '2px' }}>
              {r.ok === null ? 'Verification en cours...' : r.ok ? r.detail : r.detailKo}
            </div>
          </div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: activeLayer === r.key ? r.color : '#DDD8CF' }} />
        </button>
      ))}
    </div>
  )
}
