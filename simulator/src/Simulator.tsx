'use client'
import { useState } from 'react'
import type { Profile, Step, AddressResult, SimulatorProps } from './types'
import AddressStep from './AddressStep'
import DiagnosticPanel from './DiagnosticPanel'

const STEPS_PART = [
  { q: 'Quel est votre projet ?', opts: [
    { l: 'Nouvelle construction', s: 'Maison neuve ou en construction' },
    { l: 'Remplacement de chaudiere', s: 'Passage du gaz ou mazout' },
    { l: 'Extension ou renovation', s: 'Amelioration systeme existant' },
  ]},
  { q: 'Superficie a chauffer ?', opts: [
    { l: 'Moins de 150 m2', s: '' },
    { l: '150 a 300 m2', s: '' },
    { l: 'Plus de 300 m2', s: '' },
  ]},
]

const STEPS_PRO = [
  { q: 'Type de batiment ?', opts: [
    { l: 'Immeuble residentiel', s: 'Appartements, logements collectifs' },
    { l: 'Batiment tertiaire ou public', s: 'Bureau, ecole, hopital' },
    { l: 'Industrie ou entrepot', s: 'Production ou stockage' },
  ]},
  { q: 'Puissance thermique estimee ?', opts: [
    { l: 'Moins de 50 kW', s: 'Petit batiment' },
    { l: '50 a 500 kW', s: 'Batiment de taille moyenne' },
    { l: 'Plus de 500 kW', s: 'Grand projet ou reseau de chaleur' },
  ]},
]

export default function Simulator({ devisUrl, soumissionUrl, onResult }: SimulatorProps) {
  const [profile, setProfile] = useState<Profile>(null)
  const [step, setStep] = useState<Step>(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [address, setAddress] = useState<AddressResult | null>(null)
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{ lat: number; lng: number }> | null>(null)

  const steps = profile === 'part' ? STEPS_PART : STEPS_PRO
  const totalSteps = steps.length + 1
  const currentStep = typeof step === 'number' && step > 0 ? steps[step - 1] : null
  const progress = step === 0 ? 0 : step === 'result' ? totalSteps : step === 'map' ? totalSteps : step === 'address' ? steps.length : (step as number)
  const ctaUrl = profile === 'part' ? devisUrl : soumissionUrl

  function choose(p: Profile) { setProfile(p); setStep(1); setAnswers([]) }

  function answer(val: string) {
    const newAnswers = [...answers, val]
    setAnswers(newAnswers)
    if (newAnswers.length >= steps.length) setStep('address')
    else setStep(newAnswers.length as Step)
  }

  function handleAddressConfirm(a: AddressResult) {
    setAddress(a)
    import('./LeafletMap').then((mod) => setMapComponent(() => mod.default))
    setStep('map')
  }

  function handleMapConfirm() {
    setStep('result')
    onResult?.(profile, answers, address)
  }

  function back() {
    if (step === 1) { setStep(0); setProfile(null); setAnswers([]) }
    else if (step === 2) { setStep(1); setAnswers(answers.slice(0, 1)) }
    else if (step === 'address') { setStep(2) }
    else if (step === 'map') { setStep('address'); setAddress(null) }
    else if (step === 'result') { setStep('map') }
  }

  const ProgressBar = ({ current }: { current: number }) => (
    <div className="flex gap-1 mb-5">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className={'h-0.5 flex-1 ' + (i < current ? 'bg-wdd-yellow' : 'bg-white/10')} />
      ))}
    </div>
  )

  const BackBtn = () => (
    <button onClick={back} className="text-xs text-white/35 hover:text-wdd-yellow mb-4 transition-colors">
      Retour
    </button>
  )

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-1">Mon projet geothermique</h2>
        <p className="text-xs font-light text-white/40 leading-relaxed">
          {totalSteps} etapes pour evaluer la faisabilite de votre projet en Wallonie.
        </p>
      </div>

      {step === 0 && (
        <div className="grid grid-cols-2 gap-1">
          {(['part', 'pro'] as const).map((p) => (
            <button key={p} onClick={() => choose(p)} className="bg-white/5 border-2 border-transparent hover:border-wdd-yellow p-6 text-left transition-all group">
              <div className="text-sm font-semibold text-white mb-1">{p === 'part' ? 'Particulier' : 'Professionnel'}</div>
              <div className="text-xs font-light text-white/35">{p === 'part' ? 'Maison ou appartement' : 'Entreprise ou institution'}</div>
              <div className="text-wdd-yellow text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Commencer +</div>
            </button>
          ))}
        </div>
      )}

      {typeof step === 'number' && step > 0 && currentStep && (
        <div>
          <BackBtn />
          <ProgressBar current={progress} />
          <div className="text-xs font-light tracking-widest uppercase text-wdd-yellow mb-2">
            {profile === 'part' ? 'Particulier' : 'Professionnel'} - Etape {step} / {totalSteps}
          </div>
          <div className="text-sm font-semibold text-white mb-4">{currentStep.q}</div>
          <div className="flex flex-col gap-0.5">
            {currentStep.opts.map((opt) => (
              <button key={opt.l} onClick={() => answer(opt.l)} className="bg-white/5 hover:bg-white/10 border-l-2 border-transparent hover:border-wdd-yellow p-3 text-left transition-all flex items-center justify-between group">
                <div>
                  <div className="text-sm font-light text-white/80">{opt.l}</div>
                  {opt.s && <div className="text-xs font-light text-white/30 mt-0.5">{opt.s}</div>}
                </div>
                <span className="text-wdd-yellow text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-2">+</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'address' && (
        <div>
          <BackBtn />
          <ProgressBar current={steps.length} />
          <AddressStep onConfirm={handleAddressConfirm} />
        </div>
      )}

      {step === 'map' && address && (
        <div>
          <BackBtn />
          <div className="text-xs font-light tracking-widest uppercase text-wdd-yellow mb-2">Confirmation</div>
          <div className="text-sm font-semibold text-white mb-1">Votre chantier se situe ici ?</div>
          <div className="text-xs text-white/40 mb-3 leading-relaxed truncate">{address.label}</div>
          <div className="border border-white/10 overflow-hidden mb-1">
            {MapComponent ? (
              <MapComponent lat={address.lat} lng={address.lng} />
            ) : (
              <div className="h-48 bg-white/5 flex items-center justify-center">
                <span className="text-xs text-white/30">Chargement de la carte...</span>
              </div>
            )}
          </div>
          <DiagnosticPanel lat={address.lat} lng={address.lng} />
          <div className="mt-3">
            <button onClick={handleMapConfirm} className="block w-full py-3 bg-wdd-yellow text-wdd-black text-sm font-bold text-center hover:bg-wdd-yellow/90 transition-colors">
              Confirmer cette adresse
            </button>
            <button onClick={back} className="block w-full py-2 mt-0.5 text-xs text-white/30 text-center hover:text-white/60 transition-colors">
              Ce n est pas la bonne adresse
            </button>
          </div>
        </div>
      )}

      {step === 'result' && (
        <div>
          <BackBtn />
          <div className="border-t-2 border-wdd-yellow bg-white/5 p-6">
            {address && <div className="text-xs text-white/30 mb-4 truncate">{address.label}</div>}
            {profile === 'part' ? (
              <div>
                <div className="text-sm font-bold text-wdd-yellow mb-2">Votre projet est realisable !</div>
                <div className="text-xl font-bold text-white mb-1">15 000 - 25 000 EUR</div>
                <div className="text-xs font-light text-white/30 mb-4">Estimation indicative forage seul, hors PAC</div>
                <div className="text-xs font-light text-white/50 leading-relaxed mb-5">Systeme avec 2 a 4 sondes de 100m. Devis precis gratuit sous 48h.</div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-bold text-wdd-yellow mb-2">Nous pouvons intervenir !</div>
                <div className="text-xs font-light text-white/50 leading-relaxed mb-5">Votre projet necessite une etude de faisabilite. Offre detaillee sous 48h.</div>
              </div>
            )}
            <a href={ctaUrl} className="block w-full py-3 bg-wdd-yellow text-wdd-black text-sm font-bold text-center">
              {profile === 'part' ? 'Obtenir mon devis precis +' : 'Soumettre mon projet +'}
            </a>
            <a href="tel:+32494142449" className="block w-full py-2.5 mt-0.5 border border-white/10 text-white/40 text-xs text-center">
              Parler a un expert : +32 494 14 24 49
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
