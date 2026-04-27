'use client'

import type React from 'react'

export type StandardStepLayoutProps = {
  children: React.ReactNode
  maxWidth?: number
}

export default function StandardStepLayout({
  children,
  maxWidth = 1440,
}: StandardStepLayoutProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth,
        margin: '0 auto',
        padding: '32px clamp(16px, 2vw, 32px) 72px',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  )
}
