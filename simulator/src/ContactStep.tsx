'use client'
import { useState } from 'react'

type ContactData = {
  prenom: string
  nom: string
  email: string
  tel: string
  cp: string
  commune: string
}

export default function ContactStep({ onAnswer }: {
  onAnswer: (value: string, next: string) => void
}) {
  const [data, setData] = useState<ContactData>({ prenom: '', nom: '', email: '', tel: '', cp: '', commune: '' })
  const [errors, setErrors] = useState<Partial<ContactData>>({})

  function validate() {
    const e: Partial<ContactData> = {}
    if (!data.prenom.trim()) e.prenom = 'Requis'
    if (!data.nom.trim()) e.nom = 'Requis'
    if (!data.email.trim() || !data.email.includes('@')) e.email = 'Email invalide'
    if (!data.tel.trim()) e.tel = 'Requis'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onAnswer(JSON.stringify(data), 'result')
  }

  const Field = ({ k, label, type = 'text', placeholder = '' }: { k: keyof ContactData; label: string; type?: string; placeholder?: string }) => (
    <div>
      <label className="text-xs text-white/40 mb-1 block">{label}{!['cp','commune'].includes(k) ? ' *' : ''}</label>
      <input
        type={type}
        value={data[k]}
        onChange={(e) => { setData((d) => ({ ...d, [k]: e.target.value })); setErrors((err) => ({ ...err, [k]: '' })) }}
        placeholder={placeholder}
        className="w-full bg-white/5 border text-white text-sm font-light px-3 py-2.5 outline-none focus:border-wdd-yellow placeholder-white/15 transition-colors"
        style={{ borderColor: errors[k] ? '#ef4444' : 'rgba(255,255,255,0.15)' }}
      />
      {errors[k] && <div className="text-xs text-red-400 mt-1">{errors[k]}</div>}
    </div>
  )

  return (
    <div>
      <p className="text-xs font-light text-white/35 leading-relaxed mb-5 border-l border-wdd-yellow/30 pl-3">
        Nous vous envoyons une synthese personnalisee avec les premieres recommandations. Aucun demarchage sans votre accord.
      </p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Field k="prenom" label="Prenom" />
        <Field k="nom" label="Nom" />
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <Field k="email" label="Email" type="email" placeholder="vous@exemple.be" />
        <Field k="tel" label="Telephone" type="tel" placeholder="+32 4xx xx xx xx" />
        <div className="grid grid-cols-2 gap-2">
          <Field k="cp" label="Code postal" placeholder="5000" />
          <Field k="commune" label="Commune" placeholder="Namur" />
        </div>
      </div>
      <button onClick={handleSubmit} className="block w-full py-3 bg-wdd-yellow text-wdd-black text-sm font-bold text-center hover:bg-wdd-yellow/90 transition-colors">
        Recevoir mon analyse +
      </button>
    </div>
  )
}
