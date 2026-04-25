
'use client'
import { useState } from 'react'
import { C, F, input } from '../theme'
import { T } from '../i18n/fr'
import { Hint, QTitle, PrimaryBtn } from './Shared'

type D = { prenom: string; nom: string; email: string; tel: string; cp: string; commune: string }

export default function ContactStep({ onAnswer }: { onAnswer: (value: string, next: string) => void }) {
  const [d, setD] = useState<D>({ prenom: '', nom: '', email: '', tel: '', cp: '', commune: '' })
  const [errors, setErrors] = useState<Partial<D>>({})

  function upd(k: keyof D, v: string) { setD((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })) }

  function submit() {
    const e: Partial<D> = {}
    if (!d.prenom.trim()) e.prenom = T.contactRequired
    if (!d.nom.trim()) e.nom = T.contactRequired
    if (!d.email.includes('@')) e.email = T.contactInvalidEmail
    if (!d.tel.trim()) e.tel = T.contactRequired
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onAnswer(JSON.stringify(d), 'result')
  }

  const Label = ({ k, label, req = true }: { k: keyof D; label: string; req?: boolean }) => (
    <label style={{ fontSize: F.sm, color: C.text3, marginBottom: '4px', display: 'block' }}>
      {label}{req && ' *'}
    </label>
  )

  const Field = ({ k, label, type = 'text', ph = '', req = true }: { k: keyof D; label: string; type?: string; ph?: string; req?: boolean }) => (
    <div>
      <Label k={k} label={label} req={req} />
      <input
        type={type}
        value={d[k]}
        onChange={(e) => upd(k, e.target.value)}
        onFocus={(e) => (e.currentTarget.style.borderColor = C.accentDark)}
        onBlur={(e) => (e.currentTarget.style.borderColor = errors[k] ? C.red : C.border)}
        placeholder={ph}
        style={{ ...input(!!errors[k]), width: '100%' }}
      />
      {errors[k] && <div style={{ fontSize: '11px', color: C.red, marginTop: '3px' }}>{errors[k]}</div>}
    </div>
  )

  return (
    <div>
      <Hint>{T.contactIntro}</Hint>
      <QTitle>{T.contactTitle}</QTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <Field k="prenom" label={T.contactPrenom} />
        <Field k="nom" label={T.contactNom} />
      </div>
      <div style={{ marginBottom: '10px' }}><Field k="email" label={T.contactEmail} type="email" ph="vous@exemple.be" /></div>
      <div style={{ marginBottom: '10px' }}><Field k="tel" label={T.contactTel} type="tel" ph="+32 4xx xx xx xx" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '20px' }}>
        <Field k="cp" label={T.contactCP} ph="5000" req={false} />
        <Field k="commune" label={T.contactCommune} ph="Namur" req={false} />
      </div>
      <PrimaryBtn onClick={submit}>{T.contactSubmit}</PrimaryBtn>
    </div>
  )
}
