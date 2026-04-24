'use client'
import { useState, useEffect, useRef } from 'react'
import type { AddressResult } from './types'

type NominatimResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

export default function AddressStep({ onConfirm }: { onConfirm: (a: AddressResult) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NominatimResult[]>([])
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
        const data: NominatimResult[] = await res.json()
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 500)
  }, [query])

  return (
    <div>
      <div className="text-xs font-light tracking-widest uppercase text-wdd-yellow mb-2">
        Adresse du chantier
      </div>
      <div className="text-sm font-semibold text-white mb-4">
        Ou se situe votre projet ?
      </div>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: Rue de la Loi 16, Namur"
          className="w-full bg-white/5 border border-white/20 text-white text-sm font-light px-4 py-3 outline-none focus:border-wdd-yellow placeholder-white/20 transition-colors"
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-3 top-3 text-xs text-white/30">...</div>
        )}
      </div>
      {results.length > 0 && (
        <div className="mt-0.5 flex flex-col gap-0.5 max-h-52 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.place_id}
              onClick={() => onConfirm({ label: r.display_name, lat: parseFloat(r.lat), lng: parseFloat(r.lon) })}
              className="bg-white/5 hover:bg-white/10 border-l-2 border-transparent hover:border-wdd-yellow px-4 py-3 text-left transition-all"
            >
              <div className="text-sm font-light text-white/80 truncate">{r.display_name}</div>
            </button>
          ))}
        </div>
      )}
      {query.length >= 4 && results.length === 0 && loading === false && (
        <div className="mt-2 text-xs text-white/30 px-1">Aucun resultat en Wallonie. Verifiez l adresse.</div>
      )}
    </div>
  )
}
