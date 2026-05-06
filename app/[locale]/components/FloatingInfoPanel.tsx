'use client'

import {motion} from 'framer-motion'

type PanelItem = {
  label: string
  value: string
  sub?: string
}

export function FloatingInfoPanel({items}: {items: [PanelItem, PanelItem, PanelItem]}) {
  const DURATION = 4
  const GAP = 6        // durée entre chaque apparition
  const REPEAT_DELAY = GAP * (items.length - 1)

  return (
    <div className="relative w-56 h-24">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{opacity: 0, y: 14}}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [14, 0, -6, -16],
          }}
          transition={{
            duration: DURATION,
            delay: i * GAP,
            repeat: Infinity,
            repeatDelay: REPEAT_DELAY,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm border border-white/15 px-4 py-3"
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">
            {item.label}
          </div>
          <div className="text-2xl font-bold text-white leading-none">{item.value}</div>
          {item.sub && (
            <div className="text-xs font-light text-white/35 mt-0.5">{item.sub}</div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
