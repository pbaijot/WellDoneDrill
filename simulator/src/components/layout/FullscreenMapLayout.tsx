'use client'

import type React from 'react'

export type FullscreenMapLayoutProps = {
  map: React.ReactNode
  leftOverlay?: React.ReactNode
  rightPanel?: React.ReactNode
  navOffsetPx?: number
  leftOffsetPx?: number
  topOffsetPx?: number
  rightOffsetPx?: number
  rightPanelWidthPx?: number
}

export default function FullscreenMapLayout({
  map,
  leftOverlay,
  rightPanel,
  navOffsetPx = 96,
  leftOffsetPx = 56,
  topOffsetPx = 30,
  rightOffsetPx = 18,
  rightPanelWidthPx = 340,
}: FullscreenMapLayoutProps) {
  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: navOffsetPx,
        bottom: 0,
        width: '100vw',
        height: `calc(100dvh - ${navOffsetPx}px)`,
        overflow: 'hidden',
        background: '#D8D8D8',
        zIndex: 20,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          minHeight: '100%',
        }}
      >
        {map}
      </div>

      {leftOverlay && (
        <div
          style={{
            position: 'absolute',
            left: leftOffsetPx,
            top: topOffsetPx,
            zIndex: 700,
            display: 'grid',
            gap: '10px',
          }}
        >
          {leftOverlay}
        </div>
      )}

      {rightPanel && (
        <div
          style={{
            position: 'absolute',
            right: rightOffsetPx,
            top: topOffsetPx,
            bottom: 18,
            width: rightPanelWidthPx,
            overflowY: 'auto',
            zIndex: 710,
            border: '1px solid #DDD8CF',
            background: 'rgba(255,255,255,0.96)',
            padding: '14px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.16)',
            boxSizing: 'border-box',
          }}
        >
          {rightPanel}
        </div>
      )}
    </div>
  )
}
