'use client'
import { useEffect, useState } from 'react'
import { C, F } from '../theme'


const CHECKS: Array<{ key: CheckKey; label: string; ok: string; ko: string; color: string }> = [
  { key: 'captage',        color: '#C62828', label: 'Prevention de captage',          ok: 'Aucune restriction de captage',          ko: 'Zone de prevention — autorisation requise' },
  { key: 'pollution',      color: '#E65100', label: 'Pollution des sols (BDES)',       ok: 'Aucune pollution recensee',              ko: 'Parcelle BDES — verification avant forage' },
  { key: 'karst',          color: '#B8860B', label: 'Contraintes karstiques',          ok: 'Hors perimetre karstique',              ko: 'Zone karstique — etude geotechnique requise' },
  { key: 'natura',         color: '#2E7D32', label: 'Natura 2000',                    ok: 'Hors perimetre Natura 2000',             ko: 'Zone Natura 2000 — evaluation requise' },
  { key: 'zi',             color: '#1565C0', label: 'Zones inondables (Directive EU)', ok: 'Hors zone inondable reglementaire',     ko: 'Zone inondable — precautions specifiques' },
]

export default function DiagnosticPanel({ lat, lng, visibleLayers, onToggleLayer }: {
  lat: number; lng: number; visibleLayers: string[]; onToggleLayer: (key: string) => void
}) {
  const [results, setResults] = useState<Record<CheckKey, boolean | null>>({
    captage: null, pollution: null, karst: null, natura: null,
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
    </div>
  )
}
