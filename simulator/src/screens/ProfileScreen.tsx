'use client'

import { C, F } from '../theme'
import { T } from '../i18n/fr'
import type { Profile } from '../types'

export type ProfileScreenProps = {
  onChooseProfile: (profile: Profile) => void
}

export default function ProfileScreen({
  onChooseProfile,
}: ProfileScreenProps) {
  return (
    <div>
      <div style={{ fontSize: F.lg, fontWeight: 600, color: C.text, marginBottom: '8px' }}>
        {T.profileTitle}
      </div>

      <div
        style={{
          fontSize: F.base,
          color: C.text2,
          lineHeight: 1.6,
          padding: '10px 14px',
          borderLeft: '3px solid ' + C.accentDark,
          background: C.bgSoft,
          marginBottom: '20px',
        }}
      >
        {T.profileIntro}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {(['part', 'pro'] as const).map((profile) => (
          <button
            key={profile}
            onClick={() => onChooseProfile(profile)}
            style={{
              background: C.bgSoft,
              border: '2px solid ' + C.border,
              padding: '24px 20px',
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(event) => {
              const element = event.currentTarget
              element.style.borderColor = C.accentDark
              element.style.background = '#FFFDF0'
            }}
            onMouseLeave={(event) => {
              const element = event.currentTarget
              element.style.borderColor = C.border
              element.style.background = C.bgSoft
            }}
          >
            <div style={{ fontSize: F.lg, fontWeight: 600, color: C.text, marginBottom: '6px' }}>
              {profile === 'part' ? T.profilePart : T.profilePro}
            </div>

            <div style={{ fontSize: F.sm, color: C.text4 }}>
              {profile === 'part' ? T.profilePartSub : T.profileProSub}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
