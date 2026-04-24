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
      <div className="flex items-center gap-3 mb-5">
        <div className="w-5 h-0.5 bg-wdd-yellow" />
        <span className="text-xs font-light tracking-widest text-wdd-yellow/60 uppercase">Sous-sol</span>
      </div>

      <h3 className="text-sm font-semibold text-white mb-1">
        Contraintes administratives verifiees.
      </h3>
      <p className="text-xs font-light text-white/45 leading-relaxed mb-6">
        Verifions maintenant les capacites thermiques du sous-sol sur 200 m de profondeur.
      </p>

      <div className="flex gap-3 mb-5">
        <div style={{ width: '32px', flexShrink: 0, position: 'relative', height: '280px' }}>
          {DEPTHS.map((d) => (
            <div key={d} style={{
              position: 'absolute',
              top: (d / 200 * 100) + '%',
              right: 0,
              transform: 'translateY(-50%)',
              fontSize: '9px',
              color: 'rgba(255,255,255,0.3)',
              whiteSpace: 'nowrap',
              textAlign: 'right',
            }}>
              {d} m
            </div>
          ))}
        </div>

        <div style={{ flex: 1, height: '280px', position: 'relative', border: '1px solid rgba(255,255,255,0.08)' }}>
          {LAYERS.map((layer) => (
            <div key={layer.name} style={{
              position: 'absolute',
              left: 0, right: 0,
              top: (layer.from / 200 * 100) + '%',
              height: ((layer.to - layer.from) / 200 * 100) + '%',
              background: layer.color,
              borderBottom: '1px solid rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '10px',
              boxSizing: 'border-box',
            }}>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {layer.name}
              </span>
            </div>
          ))}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#FFD94F' }} />
        </div>

        <div style={{ width: '80px', flexShrink: 0, height: '280px', position: 'relative' }}>
          {LAYERS.map((layer) => (
            <div key={layer.name} style={{
              position: 'absolute',
              top: ((layer.from + layer.to) / 2 / 200 * 100) + '%',
              transform: 'translateY(-50%)',
              fontSize: '8px',
              color: 'rgba(255,255,255,0.25)',
              lineHeight: 1.4,
            }}>
              <div style={{ color: '#FFD94F', fontWeight: 600, fontSize: '9px' }}>
                {layer.from === 0 ? '—' : layer.from < 35 ? '~3.5 W/mK' : layer.from < 70 ? '~2.0 W/mK' : '~2.8 W/mK'}
              </div>
              <div>conductivite</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-4 mb-5">
        <div className="text-xs font-semibold text-wdd-yellow mb-1">Potentiel geothermique</div>
        <div className="text-xs font-light text-white/50 leading-relaxed">
          Le sous-sol de cette zone presente un potentiel favorable. La conductivite thermique estimee permet d envisager un systeme de sondes verticales performant.
        </div>
      </div>

      <div className="text-xs text-white/20 mb-5 px-1">
        Donnees indicatives basees sur la geologie regionale — a affiner par mesure in situ.
      </div>

      <button
        onClick={onConfirm}
        className="block w-full py-3 bg-wdd-yellow text-wdd-black text-sm font-bold text-center hover:bg-wdd-yellow/90 transition-colors"
      >
        Voir mon estimation +
      </button>
    </div>
  )
}
