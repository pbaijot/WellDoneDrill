'use client'

const LAYERS = [
  { name: 'Sol vegetal', from: 0, to: 4, color: '#8B6F47' },
  { name: 'Limon', from: 4, to: 15, color: '#C4A882' },
  { name: 'Sable', from: 15, to: 35, color: '#D4C5A0' },
  { name: 'Argile', from: 35, to: 70, color: '#9E7B5A' },
  { name: 'Calcaire', from: 70, to: 130, color: '#B8B0A0' },
  { name: 'Schiste', from: 130, to: 200, color: '#6B6560' },
]

const DEPTHS = [0, 50, 100, 150, 200]

export default function GeologyStep({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div>
      <div style={{ fontSize: '13px', color: '#4A4540', lineHeight: 1.6, padding: '12px 16px', borderLeft: '3px solid #FFD94F', background: '#F8F5EF', marginBottom: '24px' }}>
        Contraintes administratives verifiees. Analysons maintenant les capacites thermiques du sous-sol sur 200 m de profondeur.
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'stretch' }}>

        <div style={{ width: '40px', flexShrink: 0, position: 'relative', height: '260px' }}>
          {DEPTHS.map((d) => (
            <div key={d} style={{ position: 'absolute', top: (d / 200 * 100) + '%', right: '4px', transform: 'translateY(-50%)', fontSize: '10px', color: '#9A9088', textAlign: 'right', lineHeight: 1 }}>
              {d} m
            </div>
          ))}
        </div>

        <div style={{ flex: 1, height: '260px', position: 'relative', border: '1px solid #DDD8CF', overflow: 'hidden' }}>
          {LAYERS.map((layer) => (
            <div key={layer.name} style={{
              position: 'absolute', left: 0, right: 0,
              top: (layer.from / 200 * 100) + '%',
              height: ((layer.to - layer.from) / 200 * 100) + '%',
              background: layer.color,
              borderBottom: '1px solid rgba(0,0,0,0.12)',
              display: 'flex', alignItems: 'center', paddingLeft: '12px', boxSizing: 'border-box',
            }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {layer.name}
              </span>
            </div>
          ))}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#FFD94F' }} />
        </div>

        <div style={{ width: '88px', flexShrink: 0, height: '260px', position: 'relative' }}>
          {LAYERS.map((layer) => (
            <div key={layer.name} style={{
              position: 'absolute',
              top: ((layer.from + layer.to) / 2 / 200 * 100) + '%',
              transform: 'translateY(-50%)',
              lineHeight: 1.4,
            }}>
              <div style={{ color: '#B8860B', fontWeight: 600, fontSize: '10px' }}>
                {layer.from < 15 ? '~3.5 W/mK' : layer.from < 35 ? '~2.8 W/mK' : layer.from < 70 ? '~2.0 W/mK' : '~2.8 W/mK'}
              </div>
              <div style={{ fontSize: '9px', color: '#9A9088' }}>conductivite</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#F8F5EF', border: '1px solid #DDD8CF', borderLeft: '3px solid #FFD94F', padding: '14px 16px', marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1C', marginBottom: '4px' }}>
          Potentiel geothermique favorable
        </div>
        <div style={{ fontSize: '12px', color: '#6B6057', lineHeight: 1.6 }}>
          Le sous-sol de cette zone presente un potentiel exploitable. La conductivite thermique estimee permet d envisager un systeme de sondes verticales performant.
        </div>
        <div style={{ fontSize: '11px', color: '#9A9088', marginTop: '6px' }}>
          Donnees indicatives basees sur la geologie regionale. Un test de reponse thermique (TRT) affine ces valeurs.
        </div>
      </div>

      <button
        onClick={onConfirm}
        style={{ display: 'block', width: '100%', padding: '14px', background: '#FFD94F', color: '#1A1A1A', fontSize: '14px', fontWeight: 700, textAlign: 'center', border: 'none', cursor: 'pointer' }}
      >
        Continuer vers le dimensionnement →
      </button>
    </div>
  )
}
