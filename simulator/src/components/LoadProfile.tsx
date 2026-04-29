
'use client'
import type { Answers } from '../types'
import { C, F } from '../theme'
import { T } from '../i18n/fr'
import { getSurface, hasCooling } from '../engine'

const HEATING  = [1.0, 0.95, 0.75, 0.45, 0.20, 0.05, 0.0, 0.0, 0.10, 0.40, 0.75, 0.95]
const DHW      = [0.90, 0.88, 0.82, 0.78, 0.72, 0.68, 0.65, 0.65, 0.72, 0.78, 0.85, 0.90]
const COOLING  = [0.0, 0.0, 0.0, 0.05, 0.25, 0.70, 1.0, 0.95, 0.40, 0.05, 0.0, 0.0]
const SOLAR    = [0.2, 0.3, 0.5, 0.8, 1.2, 1.5, 1.8, 1.6, 1.0, 0.6, 0.3, 0.2]
const BASE_TEMP = 12.5

function groundTemp(kWPac: number, kWCool: number, cooling: boolean) {
  return HEATING.map((_, i) => {
    const ext = HEATING[i] * kWPac * 0.015
    const sol = SOLAR[i] * 0.8
    const cool = cooling ? COOLING[i] * kWCool * 0.012 : 0
    return Math.round((BASE_TEMP + sol - ext + cool) * 10) / 10
  })
}

function pts(vals: number[], min: number, max: number, W: number, H: number, PAD: number) {
  const range = max - min || 1
  return vals.map((v, i) => {
    const x = PAD + (i / (vals.length - 1)) * (W - PAD * 2)
    const y = H - PAD - ((v - min) / range) * (H - PAD * 2)
    return x.toFixed(1) + ',' + y.toFixed(1)
  }).join(' ')
}

function areaPath(vals: number[], min: number, max: number, W: number, H: number, PAD: number) {
  const line = pts(vals, min, max, W, H, PAD)
  const bottom = H - PAD
  return 'M ' + PAD + ',' + bottom + ' ' + line.split(' ').map((p) => 'L ' + p).join(' ') + ' L ' + (W - PAD) + ',' + bottom + ' Z'
}

export default function LoadProfile({ answers }: { answers: Answers }) {
  const surface = getSurface(answers) || 150
  const a = answers as any
  const peb = String(a['a_peb'] || 'std')
  const wm2 = peb === 'A' ? 25 : peb === 'B' ? 35 : 50
  const kWMax = Math.max(4, Math.round(surface * wm2 / 1000))
  const kWDhw = Math.max(1, Math.round(surface / 80))
  const cooling = hasCooling(answers)
  const kWCool = cooling ? Math.round(kWMax * 0.6) : 0

  const hVals = HEATING.map((v) => Math.round(v * kWMax * 10) / 10)
  const dVals = DHW.map((v) => Math.round(v * kWDhw * 10) / 10)
  const cVals = COOLING.map((v) => Math.round(v * kWCool * 10) / 10)
  const gNoC  = groundTemp(kWMax, kWCool, false)
  const gWiC  = groundTemp(kWMax, kWCool, true)

  const W = 460; const H = 180; const PAD = 32
  const maxLoad = Math.max(...hVals, ...dVals, ...cVals) * 1.15 || 10
  const minG = Math.min(...gNoC, ...gWiC) - 0.5
  const maxG = Math.max(...gNoC, ...gWiC) + 0.5
  const axisColor = '#9A9088'
  const gridColor = 'rgba(0,0,0,0.06)'
  const months = T.months

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({ v: (maxLoad * f).toFixed(1), y: H - PAD - f * (H - PAD * 2) }))
  const gTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({ v: (minG + f * (maxG - minG)).toFixed(1), y: H - PAD - f * (H - PAD * 2) }))

  const Chart = ({ title, children, legend }: { title: string; children: React.ReactNode; legend: React.ReactNode }) => (
    <div style={{ background: C.bgSoft, border: '1px solid ' + C.border, padding: '16px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' as const, gap: '8px' }}>
        <div style={{ fontSize: F.sm, color: C.text3 }}>{title}</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>{legend}</div>
      </div>
      {children}
    </div>
  )

  const Legend = ({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg width="20" height="10"><line x1="0" y1="5" x2="20" y2="5" stroke={color} strokeWidth="2" strokeDasharray={dashed ? '4,3' : undefined} /></svg>
      <span style={{ fontSize: F.xs, color: C.text3 }}>{label}</span>
    </div>
  )

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ fontSize: F.xs, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: C.text4, marginBottom: '12px' }}>
        {T.graphLoadTitle}
      </div>

      <Chart
        title={T.graphLoadUnit}
        legend={
          <>
            <Legend color="#E07B54" label={T.graphHeating} />
            <Legend color="#4A90D9" label={T.graphDhw} dashed />
            {cooling && <Legend color="#27ADB5" label={T.graphCooling} />}
          </>
        }
      >
        <svg viewBox={"0 0 " + W + " " + H} style={{ width: '100%', height: '160px', overflow: 'visible', display: 'block' }}>
          <defs>
            <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E07B54" stopOpacity="0.25" /><stop offset="100%" stopColor="#E07B54" stopOpacity="0.02" /></linearGradient>
            <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#27ADB5" stopOpacity="0.2" /><stop offset="100%" stopColor="#27ADB5" stopOpacity="0.02" /></linearGradient>
          </defs>
          {yTicks.map((t, i) => (
            <g key={i}>
              <line x1={PAD} y1={t.y} x2={W - PAD} y2={t.y} stroke={gridColor} strokeWidth="1" />
              <text x={PAD - 4} y={t.y + 3} textAnchor="end" fontSize="9" fill={axisColor}>{t.v}</text>
            </g>
          ))}
          {months.map((m, i) => {
            const x = PAD + (i / (months.length - 1)) * (W - PAD * 2)
            return (
              <g key={m}>
                <line x1={x} y1={PAD} x2={x} y2={H - PAD + 4} stroke={gridColor} strokeWidth="1" />
                <text x={x} y={H - PAD + 14} textAnchor="middle" fontSize="9" fill={axisColor}>{m}</text>
              </g>
            )
          })}
          <path d={areaPath(hVals, 0, maxLoad, W, H, PAD)} fill="url(#hg)" />
          {cooling && <path d={areaPath(cVals, 0, maxLoad, W, H, PAD)} fill="url(#cg)" />}
          <polyline points={pts(hVals, 0, maxLoad, W, H, PAD)} fill="none" stroke="#E07B54" strokeWidth="2" strokeLinejoin="round" />
          <polyline points={pts(dVals, 0, maxLoad, W, H, PAD)} fill="none" stroke="#4A90D9" strokeWidth="1.5" strokeDasharray="4,3" strokeLinejoin="round" />
          {cooling && <polyline points={pts(cVals, 0, maxLoad, W, H, PAD)} fill="none" stroke="#27ADB5" strokeWidth="2" strokeLinejoin="round" />}
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={axisColor} strokeWidth="1" />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={axisColor} strokeWidth="1" />
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingInline: '2px' }}>
          <div style={{ fontSize: F.xs, color: C.text3 }}>{T.graphChauffageMax}: <strong>{kWMax} kW</strong></div>
          {cooling && <div style={{ fontSize: F.xs, color: C.text3 }}>{T.graphFroidMax}: <strong>{kWCool} kW</strong></div>}
          <div style={{ fontSize: F.xs, color: C.text3 }}>{T.graphECS}: <strong>{kWDhw} kW</strong></div>
        </div>
      </Chart>

      <Chart
        title={T.graphGroundUnit}
        legend={
          <>
            <Legend color={axisColor} label={T.graphGroundNoCooling} dashed />
            <Legend color={C.accentDark} label={T.graphGroundWithCooling} />
          </>
        }
      >
        <svg viewBox={"0 0 " + W + " " + H} style={{ width: '100%', height: '160px', overflow: 'visible', display: 'block' }}>
          {gTicks.map((t, i) => (
            <g key={i}>
              <line x1={PAD} y1={t.y} x2={W - PAD} y2={t.y} stroke={gridColor} strokeWidth="1" />
              <text x={PAD - 4} y={t.y + 3} textAnchor="end" fontSize="9" fill={axisColor}>{t.v}</text>
            </g>
          ))}
          {months.map((m, i) => {
            const x = PAD + (i / (months.length - 1)) * (W - PAD * 2)
            return (
              <g key={m}>
                <line x1={x} y1={PAD} x2={x} y2={H - PAD + 4} stroke={gridColor} strokeWidth="1" />
                <text x={x} y={H - PAD + 14} textAnchor="middle" fontSize="9" fill={axisColor}>{m}</text>
              </g>
            )
          })}
          <polyline points={pts(gNoC, minG, maxG, W, H, PAD)} fill="none" stroke={axisColor} strokeWidth="1.5" strokeDasharray="5,4" strokeLinejoin="round" />
          <polyline points={pts(gWiC, minG, maxG, W, H, PAD)} fill="none" stroke={C.accentDark} strokeWidth="2.5" strokeLinejoin="round" />
          {gWiC.map((v, i) => {
            if (i % 3 !== 0) return null
            const x = PAD + (i / (gWiC.length - 1)) * (W - PAD * 2)
            const range = maxG - minG || 1
            const y = H - PAD - ((v - minG) / range) * (H - PAD * 2)
            return <circle key={i} cx={x} cy={y} r="3" fill={C.accentDark} />
          })}
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={axisColor} strokeWidth="1" />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={axisColor} strokeWidth="1" />
        </svg>
        <div style={{ background: '#FFFDF0', border: '1px solid #DDD8CF', borderLeft: '3px solid ' + C.accentDark, padding: '12px 14px', marginTop: '8px' }}>
          <div style={{ fontSize: F.sm, fontWeight: 600, color: '#B8860B', marginBottom: '4px' }}>{T.graphImpactTitle}</div>
          <div style={{ fontSize: F.xs, color: C.text3, lineHeight: 1.6 }}>
            {cooling ? T.graphImpactTextWith : T.graphImpactTextWithout}
          </div>
        </div>
      </Chart>
    </div>
  )
}
