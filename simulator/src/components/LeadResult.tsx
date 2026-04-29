
'use client'
import type { Answers, AddressResult } from '../types'
import { C, F } from '../theme'
import { T } from '../i18n/fr'
import { getDimensioning } from '../engine'
import { MetaLabel, PrimaryBtn, SecondaryBtn } from './Shared'
import LoadProfile from './LoadProfile'

const LEAD_COLORS: Record<string, string> = {
  geothermie: C.accentDark, pac_air_eau: C.blue, conseiller: C.purple, peu_mature: C.text3,
}

export default function LeadResult({ answers, address, lead, devisUrl, soumissionUrl }: {
  answers: Answers; address: AddressResult | null; lead: string; devisUrl: string; soumissionUrl: string
}) {
  const cfg = T.leads[lead as keyof typeof T.leads] || T.leads.conseiller
  const color = LEAD_COLORS[lead] || C.text3
  const dim = getDimensioning(answers)
  const ctaUrl = lead === 'geothermie' ? devisUrl : soumissionUrl

  let contact: any = {}
  try { contact = JSON.parse(String(answers['contact'] || '{}')) } catch {}

  const Cell = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div style={{ background: C.bgSoft, border: '1px solid ' + C.border, padding: '16px' }}>
      <div style={{ fontSize: F.xs, color: C.text4, marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: 700, color: C.text }}>{value}</div>
      {sub && <div style={{ fontSize: F.xs, color: C.text4, marginTop: '3px' }}>{sub}</div>}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ width: '24px', height: '3px', background: color }} />
        <span style={{ fontSize: F.xs, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color }}>{cfg.badge}</span>
      </div>

      {contact.prenom && <div style={{ fontSize: F.base, color: C.text3, marginBottom: '8px' }}>Bonjour {contact.prenom}, voici votre analyse personnalisee.</div>}
      {address && <div style={{ fontSize: F.sm, color: C.text4, marginBottom: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{address.label}</div>}

      <div style={{ fontSize: F.base, color: C.text2, lineHeight: 1.6, padding: '12px 16px', borderLeft: '3px solid ' + color, background: C.bgSoft, marginBottom: '24px' }}>
        {cfg.text}
      </div>

      <MetaLabel>{T.resultDimensioning}</MetaLabel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
        <Cell label={T.resultPuissance} value={dim.kWMin + ' – ' + dim.kWMax + ' kW'} sub={dim.surface > 0 ? dim.surface + ' m2' : undefined} />
        <Cell label={T.resultCOP} value={dim.cop} sub={T.resultCOPSub} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
        <Cell label={T.resultSondes} value={dim.sondesMin + ' – ' + dim.sondesMax} sub={T.resultSondesSub} />
        <Cell label={T.resultProfondeur} value={dim.sondesMin * 100 + ' – ' + dim.sondesMax * 100 + ' m'} sub={T.resultProfondeurSub} />
      </div>

      <div style={{ background: C.bg, border: '2px solid ' + color, padding: '16px', marginBottom: '6px' }}>
        <div style={{ fontSize: F.xs, color: C.text4, marginBottom: '4px' }}>{T.resultPrix}</div>
        <div style={{ fontSize: '24px', fontWeight: 700, color: C.text }}>{dim.prixMin.toLocaleString('fr-BE')} – {dim.prixMax.toLocaleString('fr-BE')} EUR</div>
        <div style={{ fontSize: F.xs, color: C.text4, marginTop: '4px' }}>{T.resultPrixSub}</div>
      </div>

      <div style={{ background: C.bgSoft, padding: '12px 16px', marginBottom: '24px', border: '1px solid ' + C.border }}>
        <div style={{ fontSize: F.xs, color: C.text4, lineHeight: 1.6 }}>{T.resultNote}</div>
      </div>

      <LoadProfile answers={answers} />

      <MetaLabel>{T.resultRecs}</MetaLabel>
      <div style={{ marginBottom: '24px' }}>
        {cfg.recs.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', background: C.bgSoft, border: '1px solid ' + C.border, padding: '12px 14px', marginBottom: '4px' }}>
            <div style={{ width: '20px', height: '20px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: F.xs, fontWeight: 700, color: '#FFFFFF', flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: F.base, color: C.text2, lineHeight: 1.6 }}>{r}</div>
          </div>
        ))}
      </div>

      <PrimaryBtn href={ctaUrl} color={color === C.accentDark ? C.accent : color}>{cfg.cta}</PrimaryBtn>
      <SecondaryBtn href={T.phoneHref}>{T.phone}</SecondaryBtn>
    </div>
  )
}
