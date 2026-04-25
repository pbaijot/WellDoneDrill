
'use client'
import { useEffect, useState } from 'react'
import { C, F } from '../theme'
import { T } from '../i18n/fr'

type CheckKey = keyof typeof T.checks
type Result = { key: CheckKey; ok: boolean | null }

const CHECK_KEYS: CheckKey[] = ['captage','pollution','karst','natura','inondations']
const CHECK_COLORS: Record<CheckKey, string> = {
  captage: '#C62828', pollution: '#E65100', karst: '#B8860B', natura: '#2E7D32', inondations: '#1565C0',
}

export default function DiagnosticPanel({ lat, lng, activeLayer, onLayerClick }: {
  lat: number; lng: number; activeLayer: string; onLayerClick: (k: string) => void
}) {
  const [results, setResults] = useState<Result[]>(CHECK_KEYS.map((k) => ({ key: k, ok: null })))

  useEffect(() => {
    const updated: Result[] = CHECK_KEYS.map((k) => ({ key: k, ok: null }))
    setResults([...updated])
    Promise.all(CHECK_KEYS.map(async (key, i) => {
      try {
        const res = await fetch('/api/geocheck?lat=' + lat + '&lng=' + lng + '&layer=' + key)
        const data = await res.json()
        updated[i] = { key, ok: data.hasFeatures === null ? null : !data.hasFeatures }
      } catch { updated[i] = { key, ok: null } }
      setResults([...updated])
    }))
  }, [lat, lng])

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ fontSize: F.xs, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.text4, marginBottom: '8px' }}>
        {T.mapDiagTitle}
      </div>
      {results.map((r) => {
        const cfg = T.checks[r.key]
        const color = CHECK_COLORS[r.key]
        const isActive = activeLayer === r.key
        return (
          <button
            key={r.key}
            onClick={() => onLayerClick(r.key)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', width: '100%', textAlign: 'left', background: isActive ? '#FFFDF0' : C.bg, border: '1px solid ' + C.border, borderLeft: '3px solid ' + (isActive ? color : C.border), marginBottom: '4px', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <div style={{ width: '20px', textAlign: 'center', flexShrink: 0, fontSize: '14px', fontWeight: 700 }}>
              {r.ok === null
                ? <span style={{ color: C.text4, fontSize: F.xs }}>···</span>
                : r.ok
                ? <span style={{ color: C.green }}>✓</span>
                : <span style={{ color }}>{String.fromCharCode(10007)}</span>
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: F.base, fontWeight: 500, color: C.text }}>{cfg.label}</div>
              <div style={{ fontSize: F.xs, color: C.text4, marginTop: '2px' }}>
                {r.ok === null ? T.checkPending : r.ok ? cfg.ok : cfg.ko}
              </div>
            </div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: isActive ? color : C.border }} />
          </button>
        )
      })}
    </div>
  )
}
