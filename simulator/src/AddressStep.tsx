'use client'
import { useState, useEffect, useRef } from 'react'
import type { AddressResult } from './types'

const T = {
  bg: '#FFFFFF', bgSoft: '#F8F5EF', bgMuted: '#F2EFE9',
  border: '#DDD8CF', borderStrong: '#B8B0A0',
  text: '#1C1C1C', text2: '#4A4540', text3: '#6B6057', text4: '#9A9088',
  accent: '#FFD94F', accentDark: '#E6C200',
}

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

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1.5px solid ' + T.border, background: T.bg,
    color: T.text, fontSize: '14px', padding: '12px 14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  }

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: Rue de la Loi 16, Namur"
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = T.accentDark)}
          onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
          autoComplete="off"
        />
        {loading && (
          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: T.text4 }}>
            ...
          </span>
        )}
      </div>
      {results.map((r) => (
        <div
          key={r.place_id}
          onClick={() => onConfirm({ label: r.display_name, lat: parseFloat(r.lat), lng: parseFloat(r.lon) })}
          style={{ background: T.bg, border: '1px solid ' + T.border, borderTop: 'none', padding: '10px 14px', cursor: 'pointer', fontSize: '13px', color: T.text2 }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = T.bgSoft)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = T.bg)}
        >
          {r.display_name}
        </div>
      ))}
      {query.length >= 4 && results.length === 0 && !loading && (
        <div style={{ fontSize: '12px', color: T.text4, padding: '8px 0' }}>
          Aucun resultat en Wallonie. Verifiez l adresse.
        </div>
      )}
    </div>
  )
}
