'use client'

export default function DimChoice({ onChoice }: { onChoice: (c: 'simple' | 'precis') => void }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-5 h-0.5 bg-wdd-yellow" />
        <span className="text-xs font-light tracking-widest text-wdd-yellow/60 uppercase">
          Dimensionnement
        </span>
      </div>
      <h3 className="text-sm font-semibold text-white mb-2">
        Jusqu ou souhaitez-vous aller ?
      </h3>
      <p className="text-xs font-light text-white/40 leading-relaxed mb-6">
        Vous pourrez toujours revenir pour affiner votre estimation.
      </p>
      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => onChoice('simple')}
          className="bg-white/5 border-2 border-transparent hover:border-wdd-yellow p-5 text-left transition-all group"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="text-sm font-semibold text-white">Estimation rapide</div>
            <div className="text-xs text-wdd-yellow/60 font-light ml-3 flex-shrink-0">moins d 1 min</div>
          </div>
          <div className="text-xs font-light text-white/40 leading-relaxed">
            Sur base de la superficie de votre logement, nous calculons une fourchette de puissance et de cout indicatif.
          </div>
          <div className="text-wdd-yellow text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            Commencer +
          </div>
        </button>
        <button
          onClick={() => onChoice('precis')}
          className="bg-white/5 border-2 border-transparent hover:border-wdd-yellow p-5 text-left transition-all group"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="text-sm font-semibold text-white">Dimensionnement precis</div>
            <div className="text-xs text-wdd-yellow/60 font-light ml-3 flex-shrink-0">environ 5 min</div>
          </div>
          <div className="text-xs font-light text-white/40 leading-relaxed">
            Quelques questions supplementaires pour un dimensionnement sur-mesure, une estimation detaillee et une mise en contact avec un installateur.
          </div>
          <div className="text-wdd-yellow text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            Commencer +
          </div>
        </button>
      </div>
    </div>
  )
}
