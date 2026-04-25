'use client'
import type { Answers } from './types'

// ─── DONNÉES ─────────────────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']

// Profil chauffage mensuel (% de la puissance max) selon climat wallon
const HEATING_PROFILE = [1.0, 0.95, 0.75, 0.45, 0.20, 0.05, 0.0, 0.0, 0.10, 0.40, 0.75, 0.95]

// ECS relativement stable, légèrement plus en hiver
const DHW_PROFILE = [0.90, 0.88, 0.82, 0.78, 0.72, 0.68, 0.65, 0.65, 0.72, 0.78, 0.85, 0.90]

// Refroidissement (% de la puissance de refroidissement max)
const COOLING_PROFILE = [0.0, 0.0, 0.0, 0.05, 0.25, 0.70, 1.0, 0.95, 0.40, 0.05, 0.0, 0.0]

// Impact sur la température du sol (recharge solaire incluse)
// Sans refroidissement : le sol se refroidit légèrement en hiver
// Avec refroidissement : le sol se rechauffe en été → meilleur équilibre
function calcGroundTemp(kWPac: number, kWCooling: number, hasCooling: boolean) {
  const baseTemp = 12.5 // température initiale du sol en Wallonie
  return MONTHS.map((_, i) => {
    // extraction en hiver refroidit le sol, recharge solaire le rechauffe
    const extraction = HEATING_PROFILE[i] * kWPac * 0.7
    const solarRecharge = [0.2, 0.3, 0.5, 0.8, 1.2, 1.5, 1.8, 1.6, 1.0, 0.6, 0.3, 0.2][i]
    const cooling = hasCooling ? COOLING_PROFILE[i] * kWCooling * 0.8 : 0
    const delta = ((solarRecharge * 0.8) - (extraction * 0.015) + (cooling * 0.012))
    return Math.round((baseTemp + delta) * 10) / 10
  })
}

// ─── HELPERS SVG ─────────────────────────────────────────────────────────────

function polyline(values: number[], min: number, max: number, w: number, h: number, pad: number): string {
  const range = max - min || 1
  return values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / range) * (h - pad * 2)
    return x.toFixed(1) + ',' + y.toFixed(1)
  }).join(' ')
}

function area(values: number[], min: number, max: number, w: number, h: number, pad: number): string {
  const pts = polyline(values, min, max, w, h, pad)
  const firstX = pad
  const lastX = w - pad
  const bottom = h - pad
  return 'M ' + firstX + ',' + bottom + ' L ' + pts.split(' ').map(p => 'L ' + p).join(' ').slice(2) + ' L ' + lastX + ',' + bottom + ' Z'
}

// ─── COMPOSANT ────────────────────────────────────────────────────────────────

export default function LoadProfile({ answers }: { answers: Answers }) {
  const surface = parseFloat(String(answers['a_surface'] || answers['b_surface'] || '150'))
  const emetteurs = String(answers['a_emetteurs'] || answers['b_emetteurs'] || 'sol')
  const peb = String(answers['a_peb'] || 'std')
  const objectifs = String(answers['objectifs'] || '')
  const hasCooling = objectifs.includes('froid') || emetteurs === 'sol' || emetteurs === 'ventilos'

  const wPerM2 = peb === 'A' ? 25 : peb === 'B' ? 35 : 50
  const kWPacMax = Math.round(surface * wPerM2 / 1000)
  const kWDhw = Math.max(1, Math.round(surface / 80))
  const kWCooling = hasCooling ? Math.round(kWPacMax * 0.6) : 0

  const heatingVals = HEATING_PROFILE.map(v => Math.round(v * kWPacMax * 10) / 10)
  const dhwVals = DHW_PROFILE.map(v => Math.round(v * kWDhw * 10) / 10)
  const coolingVals = COOLING_PROFILE.map(v => Math.round(v * kWCooling * 10) / 10)

  const groundNoC = calcGroundTemp(kWPacMax, kWCooling, false)
  const groundWithC = calcGroundTemp(kWPacMax, kWCooling, true)

  const W = 480
  const H = 200
  const PAD = 36

  const maxLoad = Math.max(...heatingVals, ...dhwVals, ...coolingVals) * 1.1 || 10
  const minGround = Math.min(...groundNoC, ...groundWithC) - 0.5
  const maxGround = Math.max(...groundNoC, ...groundWithC) + 0.5

  const hPts = polyline(heatingVals, 0, maxLoad, W, H, PAD)
  const dPts = polyline(dhwVals, 0, maxLoad, W, H, PAD)
  const cPts = polyline(coolingVals, 0, maxLoad, W, H, PAD)
  const hArea = area(heatingVals, 0, maxLoad, W, H, PAD)
  const cArea = area(coolingVals, 0, maxLoad, W, H, PAD)

  const gNoPts = polyline(groundNoC, minGround, maxGround, W, H, PAD)
  const gWithPts = polyline(groundWithC, minGround, maxGround, W, H, PAD)

  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map(f => ({
    v: Math.round(maxLoad * f * 10) / 10,
    y: H - PAD - f * (H - PAD * 2),
  }))

  const gTicks = [0, 0.25, 0.5, 0.75, 1.0].map(f => ({
    v: Math.round((minGround + f * (maxGround - minGround)) * 10) / 10,
    y: H - PAD - f * (H - PAD * 2),
  }))

  return (
    <div className="mt-6">
      <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
        Profil de charge annuel
      </div>

      {/* ── GRAPHE 1 : CHARGES ── */}
      <div className="bg-white/3 border border-white/8 p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-light text-white/50">Puissance thermique mensuelle (kW)</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-orange-400" />
              <span className="text-xs text-white/35">Chauffage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-blue-400" />
              <span className="text-xs text-white/35">ECS</span>
            </div>
            {hasCooling && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-cyan-400" />
                <span className="text-xs text-white/35">Froid</span>
              </div>
            )}
          </div>
        </div>

        <svg viewBox={"0 0 " + W + " " + H} className="w-full" style={{ height: '180px' }}>
          <defs>
            <linearGradient id="heatGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="coolGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {yTicks.map((t, i) => (
            <g key={i}>
              <line x1={PAD} y1={t.y} x2={W - PAD + 4} y2={t.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x={PAD - 4} y={t.y + 3} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.25)">{t.v}</text>
            </g>
          ))}

          {MONTHS.map((m, i) => {
            const x = PAD + (i / (MONTHS.length - 1)) * (W - PAD * 2)
            return (
              <g key={m}>
                <line x1={x} y1={PAD} x2={x} y2={H - PAD + 4} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <text x={x} y={H - PAD + 14} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.3)">{m}</text>
              </g>
            )
          })}

          <path d={hArea} fill="url(#heatGrad)" />
          {hasCooling && <path d={cArea} fill="url(#coolGrad)" />}

          <polyline points={hPts} fill="none" stroke="#f97316" strokeWidth="2" strokeLinejoin="round" />
          <polyline points={dPts} fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,3" strokeLinejoin="round" />
          {hasCooling && <polyline points={cPts} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinejoin="round" />}

          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </svg>

        <div className="flex justify-between mt-2 px-1">
          <div className="text-xs text-white/25">Chauffage max : <span className="text-white/50 font-semibold">{kWPacMax} kW</span></div>
          {hasCooling && <div className="text-xs text-white/25">Froid max : <span className="text-cyan-400/70 font-semibold">{kWCooling} kW</span></div>}
          <div className="text-xs text-white/25">ECS : <span className="text-blue-400/70 font-semibold">{kWDhw} kW</span></div>
        </div>
      </div>

      {/* ── GRAPHE 2 : TEMPERATURE SOL ── */}
      <div className="bg-white/3 border border-white/8 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-light text-white/50">Temperature du sous-sol (°C)</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-white/30" style={{ borderTop: '1px dashed rgba(255,255,255,0.4)' }} />
              <span className="text-xs text-white/35">Sans refroidissement</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-wdd-yellow" />
              <span className="text-xs text-white/35">Avec refroidissement</span>
            </div>
          </div>
        </div>

        <svg viewBox={"0 0 " + W + " " + H} className="w-full" style={{ height: '180px' }}>
          {gTicks.map((t, i) => (
            <g key={i}>
              <line x1={PAD} y1={t.y} x2={W - PAD + 4} y2={t.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x={PAD - 4} y={t.y + 3} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.25)">{t.v}</text>
            </g>
          ))}

          {MONTHS.map((m, i) => {
            const x = PAD + (i / (MONTHS.length - 1)) * (W - PAD * 2)
            return (
              <g key={m}>
                <line x1={x} y1={PAD} x2={x} y2={H - PAD + 4} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <text x={x} y={H - PAD + 14} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.3)">{m}</text>
              </g>
            )
          })}

          <polyline points={gNoPts} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="5,4" strokeLinejoin="round" />
          <polyline points={gWithPts} fill="none" stroke="#FFD94F" strokeWidth="2" strokeLinejoin="round" />

          {groundWithC.map((v, i) => {
            const x = PAD + (i / (groundWithC.length - 1)) * (W - PAD * 2)
            const range = maxGround - minGround || 1
            const y = H - PAD - ((v - minGround) / range) * (H - PAD * 2)
            if (i % 3 !== 0) return null
            return <circle key={i} cx={x} cy={y} r="2.5" fill="#FFD94F" />
          })}

          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </svg>

        <div className="mt-3 bg-wdd-yellow/8 border border-wdd-yellow/15 p-3">
          <div className="text-xs font-semibold text-wdd-yellow mb-1">Impact du refroidissement sur le sous-sol</div>
          <div className="text-xs font-light text-white/45 leading-relaxed">
            {hasCooling
              ? "En ete, la geothermie reinjecte de la chaleur dans le sol via le circuit de refroidissement. Cela compense partiellement le refroidissement hivernal et ameliore les performances de la PAC sur le long terme."
              : "Sans refroidissement estival, le sol se refroidit progressivement au fil des annees d extraction. L ajout d un circuit de free cooling permet de recharger thermiquement le sol en ete et d ameliorer le COP hivernal."}
          </div>
        </div>
      </div>
    </div>
  )
}
