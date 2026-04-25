
'use client'
import { useState, useEffect, useRef } from 'react'
import type { AddressResult } from '../types'
import { C, F, input } from '../theme'
import { T } from '../i18n/fr'

type NomResult = { place_id: number; display_name: string; lat: string; lon: string }

export default function AddressStep({ onConfirm }: { onConfirm: (a: AddressResult) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NomResult[]>([])
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (query.length < 4) { setResults([]); return }
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const url = 'https://nominatim.openstreetmap.org/search?format=json&countrycodes=be&viewbox=2.85,50.85,6.5,49.45&bounded=1&limit=5&accept-language=fr&q=' + encodeURIComponent(query)
        const res = await fetch(url, { headers: { 'User-Agent': 'WellDoneDrill-Simulator/1.0' } })
        setResults(await res.json())
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 500)
  }, [query])

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={T.addressPlaceholder}
          style={{ ...input(), width: '100%' }}
          onFocus={(e) => (e.currentTarget.style.borderColor = C.accentDark)}
          onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
          autoComplete="off"
        />
        {loading && <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: F.xs, color: C.text4 }}>...</span>}
      </div>
      {results.map((r) => (
        <div
          key={r.place_id}
          onClick={() => onConfirm({ label: r.display_name, lat: parseFloat(r.lat), lng: parseFloat(r.lon) })}
          style={{ background: C.bg, border: '1px solid ' + C.border, borderTop: 'none', padding: '10px 13px', cursor: 'pointer', fontSize: F.base, color: C.text2 }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.bgSoft)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = C.bg)}
        >
          {r.display_name}
        </div>
      ))}
      {query.length >= 4 && results.length === 0 && !loading && (
        <div style={{ fontSize: F.sm, color: C.text4, padding: '8px 0' }}>{T.addressNoResult}</div>
      )}
    </div>
  )
}
