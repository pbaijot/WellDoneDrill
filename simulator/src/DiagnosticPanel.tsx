'use client'
import { useEffect, useState } from 'react'

type CheckResult = {
  key: string
  label: string
  ok: boolean | null
  detail: string
  detailKo: string
}

const CHECKS: CheckResult[] = [
  {
    key: 'captage',
    label: 'Zone de prevention de captage',
    ok: null,
    detail: 'Aucune restriction de captage detectee',
    detailKo: 'Zone de prevention detectee — forage soumis a autorisation',
  },
  {
    key: 'natura',
    label: 'Natura 2000',
    ok: null,
    detail: 'Hors perimetre Natura 2000',
    detailKo: 'Zone Natura 2000 — etude d impact requise',
  },
]

export default function DiagnosticPanel({ lat, lng }: { lat: number; lng: number }) {
  const [results, setResults] = useState<CheckResult[]>(CHECKS.map((c) => ({ ...c })))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const updated = CHECKS.map((c) => ({ ...c, ok: null }))
    setResults(updated)

    const checks = CHECKS.map(async (check, i) => {
      try {
        const res = await fetch('/api/geocheck?lat=' + lat + '&lng=' + lng + '&layer=' + check.key)
        const data = await res.json()
        updated[i] = { ...check, ok: data.hasFeatures === null ? null : !data.hasFeatures }
      } catch {
        updated[i] = { ...check, ok: null }
      }
      setResults([...updated])
    })

    Promise.all(checks).then(() => setLoading(false))
  }, [lat, lng])

  return (
    <div className="mt-3 flex flex-col gap-1.5">
      <div className="text-xs font-light tracking-widest uppercase text-white/30 mb-1">
        Diagnostic reglementaire
      </div>
      {results.map((r) => (
        <div key={r.key} className="flex items-start gap-3 bg-white/5 px-4 py-3">
          <div className="flex-shrink-0 mt-0.5">
            {r.ok === null ? (
              <span className="text-white/20 text-sm">...</span>
            ) : r.ok ? (
              <span className="text-green-400 font-bold text-sm">V</span>
            ) : (
              <span className="text-red-400 font-bold text-sm">X</span>
            )}
          </div>
          <div>
            <div className="text-xs font-semibold text-white/70">{r.label}</div>
            <div className="text-xs font-light text-white/35 mt-0.5">
              {r.ok === null ? 'Verification en cours...' : r.ok ? r.detail : r.detailKo}
            </div>
          </div>
        </div>
      ))}
      {loading && (
        <div className="text-xs text-white/20 px-1 mt-1">
          Interrogation du geoportail wallon...
        </div>
      )}
    </div>
  )
}
