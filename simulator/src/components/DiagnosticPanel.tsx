'use client'
import { useEffect, useState } from 'react'
import { C, F } from '../theme'
import { T } from '../i18n/fr'

type CheckKey = keyof typeof T.checks
type CheckResult = { key: CheckKey; ok: boolean | null }

const CHECK_KEYS: CheckKey[] = ['captage', 'pollution', 'karst', 'natura', 'inondations']

const CHECK_COLORS: Record<CheckKey, string> = {
  captage:     '#C62828',
  pollution:   '#E65100',
  karst:       '#B8860B',
  natura:      '#2E7D32',
  inondations: '#1565C0',
}

export default function DiagnosticPanel({ lat, lng, visibleLayers, onToggleLayer }: {
  lat: number
  lng: number
  visibleLayers: string[]
  onToggleLayer: (key: string) => void
}) {
  const [checks, setChecks] = useState<CheckResult[]>(CHECK_KEYS.map((k) => ({ key: k, ok: null })))

  useEffect(() => {
    const updated: CheckResult[] = CHECK_KEYS.map((k) => ({ key: k, ok: null }))
    setChecks([...updated])

    Promise.all(CHECK_KEYS.map(async (key, i) => {
      try {
        const res = await fetch('/api/geocheck?lat=' + lat + '&lng=' + lng + '&layer=' + key)
        const data = await res.json()
        updated[i] = { key, ok: data.hasFeatures === null ? null : !data.hasFeatures }
      } catch {
        updated[i] = { key, ok: null }
      }
      setChecks([...updated])
    }))
  }, [lat, lng])

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ fontSize: F.xs, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.text4, marginBottom: '8px' }}>
        {T.mapDiagTitle}
      </div>
      {checks.map((r) => {
        const cfg = T.checks[r.key]
        const color = CHECK_COLORS[r.key]
        const isVisible = visibleLayers.includes(r.key)

        return (
          <button
            key={r.key}
            onClick={() => onToggleLayer(r.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px', width: '100%', textAlign: 'left',
              background: isVisible ? '#FFFDF0' : C.bg,
              border: '1px solid ' + C.border,
              borderLeft: '3px solid ' + (isVisible ? color : C.border),
              marginBottom: '4px', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {/* Icone V / X / ... selon GetFeatureInfo */}
            <div style={{ width: '20px', textAlign: 'center', flexShrink: 0, fontSize: '14px', fontWeight: 700 }}>
              {r.ok === null
                ? <span style={{ color: C.text4, fontSize: F.xs }}>···</span>
                : r.ok
                ? <span style={{ color: C.green }}>✓</span>
                : <span style={{ color }}>✗</span>
              }
            </div>

            {/* Label + detail */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: F.base, fontWeight: 500, color: C.text }}>{cfg.label}</div>
              <div style={{ fontSize: F.xs, color: C.text4, marginTop: '2px' }}>
                {r.ok === null ? T.checkPending : r.ok ? cfg.ok : cfg.ko}
              </div>
            </div>

            {/* Toggle oeil — indique si le layer est affiché sur la carte */}
            <div style={{
              flexShrink: 0, fontSize: '11px', fontWeight: 600,
              color: isVisible ? color : C.text4,
              border: '1px solid ' + (isVisible ? color : C.border),
              padding: '2px 6px',
              lineHeight: 1.4,
            }}>
              {isVisible ? 'ON' : 'OFF'}
            </div>
          </button>
        )
      })}
    </div>
  )
}
