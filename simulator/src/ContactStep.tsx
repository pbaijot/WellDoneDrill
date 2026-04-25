'use client'
import { useState } from 'react'

type D = { prenom: string; nom: string; email: string; tel: string; cp: string; commune: string }

export default function ContactStep({ onAnswer }: { onAnswer: (value: string, next: string) => void }) {
  const [d, setD] = useState<D>({ prenom: '', nom: '', email: '', tel: '', cp: '', commune: '' })
  const [errors, setErrors] = useState<Partial<D>>({})

  function upd(k: keyof D, v: string) {
    setD((p) => ({ ...p, [k]: v }))
    setErrors((e) => ({ ...e, [k]: '' }))
  }

  function submit() {
    const e: Partial<D> = {}
    if (!d.prenom.trim()) e.prenom = 'Requis'
    if (!d.nom.trim()) e.nom = 'Requis'
    if (!d.email.includes('@')) e.email = 'Email invalide'
    if (!d.tel.trim()) e.tel = 'Requis'
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onAnswer(JSON.stringify(d), 'result')
  }

  const inputStyle = (k: keyof D): React.CSSProperties => ({
    width: '100%', border: '1.5px solid ' + (errors[k] ? '#C62828' : '#DDD8CF'),
    background: '#FFFFFF', color: '#1C1C1C', fontSize: '14px',
    padding: '10px 12px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  })

  const labelStyle: React.CSSProperties = {
    fontSize: '12px', color: '#6B6057', marginBottom: '4px', display: 'block'
  }

  const Field = ({ k, label, type = 'text', ph = '' }: { k: keyof D; label: string; type?: string; ph?: string }) => (
    <div>
      <label style={labelStyle}>{label}{!['cp','commune'].includes(k) && ' *'}</label>
      <input
        type={type}
        value={d[k]}
        onChange={(e) => upd(k, e.target.value)}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#E6C200')}
        onBlur={(e) => (e.currentTarget.style.borderColor = errors[k] ? '#C62828' : '#DDD8CF')}
        placeholder={ph}
        style={inputStyle(k)}
      />
      {errors[k] && <div style={{ fontSize: '11px', color: '#C62828', marginTop: '3px' }}>{errors[k]}</div>}
    </div>
  )

  return (
    <div>
      <div style={{ fontSize: '13px', color: '#4A4540', lineHeight: 1.6, padding: '10px 14px', borderLeft: '3px solid #FFD94F', background: '#F8F5EF', marginBottom: '16px' }}>
        Nous vous envoyons une synthese personnalisee avec les premieres recommandations. Aucun demarchage sans votre accord.
      </div>
      <div style={{ fontSize: '15px', fontWeight: 600, color: '#1C1C1C', marginBottom: '16px' }}>
        Vos coordonnees
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <Field k="prenom" label="Prenom" />
        <Field k="nom" label="Nom" />
      </div>
      <div style={{ marginBottom: '10px' }}><Field k="email" label="Email" type="email" ph="vous@exemple.be" /></div>
      <div style={{ marginBottom: '10px' }}><Field k="tel" label="Telephone" type="tel" ph="+32 4xx xx xx xx" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '20px' }}>
        <Field k="cp" label="Code postal" ph="5000" />
        <Field k="commune" label="Commune" ph="Namur" />
      </div>
      <button
        onClick={submit}
        style={{ display: 'block', width: '100%', padding: '14px', background: '#FFD94F', color: '#1A1A1A', fontSize: '14px', fontWeight: 700, textAlign: 'center', border: 'none', cursor: 'pointer' }}
      >
        Recevoir mon analyse →
      </button>
    </div>
  )
}
