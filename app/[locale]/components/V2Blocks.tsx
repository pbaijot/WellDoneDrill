'use client'

/* Building blocks shared by the V2 page layouts (Particuliers, Pro). */

import {useState, useRef, useEffect, useId} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {motion, AnimatePresence, useReducedMotion, useInView, useScroll, useMotionValueEvent} from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1] as const

export function Reveal({children, delay = 0, className}: {children: React.ReactNode; delay?: number; className?: string}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : {opacity: 0, y: 24}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-80px'}}
      transition={{duration: 0.7, delay, ease: EASE}}
    >
      {children}
    </motion.div>
  )
}

export function ContactCta({href, label, variant = 'dark', className = ''}: {href: string; label: string; variant?: 'dark' | 'yellow'; className?: string}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 px-6 py-3.5 text-sm font-bold rounded-sm transition-colors ${
        variant === 'yellow'
          ? 'bg-wdd-yellow text-wdd-black hover:bg-white'
          : 'bg-wdd-black text-white hover:bg-wdd-black/85'
      } ${className}`}
    >
      {label}
      <span className={`transition-transform group-hover:translate-x-1 ${variant === 'yellow' ? '' : 'text-wdd-yellow'}`}>→</span>
    </Link>
  )
}

export function FaqItem({question, answer, defaultOpen}: {question: string; answer: string; defaultOpen?: boolean}) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className="border-b border-black/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-6 py-6 text-left group"
      >
        <span className="text-lg font-bold leading-snug group-hover:text-wdd-mud transition-colors">
          {question}
        </span>
        <span
          className={
            'flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-base font-bold transition-all duration-300 ' +
            (open
              ? 'bg-wdd-yellow border-wdd-yellow text-wdd-black rotate-45'
              : 'border-black/20 text-black/40 group-hover:border-black/40')
          }
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.35, ease: EASE}}
            className="overflow-hidden"
          >
            <p className="text-base font-light text-black/70 leading-8 pb-7 pr-12 whitespace-pre-line">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ContextMedia({videoUrl, imageUrl, cover}: {videoUrl?: string | null; imageUrl?: string | null; cover?: boolean}) {
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !muted
    setMuted(m => !m)
  }

  const togglePause = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) el.play()
    else el.pause()
  }

  const restart = () => {
    const el = videoRef.current
    if (!el) return
    el.currentTime = 0
    el.play()
  }

  const btn = 'bg-black/50 hover:bg-black/75 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors'

  if (videoUrl) {
    return (
      <>
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay loop muted playsInline
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          className={cover ? 'absolute inset-0 w-full h-full object-cover' : 'block w-full h-auto'}
        />
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          <button onClick={restart} className={btn} aria-label="Recommencer la vidéo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/>
            </svg>
          </button>
          <button onClick={togglePause} className={btn} aria-label={paused ? 'Lire la vidéo' : 'Mettre en pause'}>
            {paused ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>
            )}
          </button>
          <button onClick={toggleMute} className={btn} aria-label={muted ? 'Activer le son' : 'Couper le son'}>
            {muted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
          </button>
        </div>
      </>
    )
  }
  return (
    <Image
      src={imageUrl ?? '/images/foreuse-wide.jpg'}
      alt=""
      fill
      className="object-cover object-center"
    />
  )
}

/* Ground cross-section, played once when it scrolls into view: the probe goes
   down to 150 m, the ground hands back 15 °C, the heat pump inside the house
   lifts it, and the house warms up. Drawn as a quiet technical section.
   The drawing is laid out in real pixels: the ground spans the full column
   width, the overall height follows the text column, the house keeps its
   proportions. House coordinates below are in its own 400-wide design space. */
const HOUSE = {top: 72, ground: 200, centerX: 210, probeX: 268, pacY: 178, pacH: 16}

// Phase timings (ms): 1 probe down · 2 ground heat · 3 up to the PAC · 4 heating, hot water, radiator
// Underfloor heating pipe between the screed lines (ground floor), in house design space
const FLOOR_PIPE = 'M128 192 q3.25 -3.2 6.5 0 t6.5 0 t6.5 0 t6.5 0 t6.5 0 t6.5 0 t6.5 0 t6.5 0 t6.5 0 t6.5 0 t6.5 0 t6.5 0 t6.5 0 t6.5 0 t6.5 0 t6.5 0'

export const LOOP_PHASE_AT = [0, 400, 3000, 4400, 5600]

const C = {
  ink: '#1A1A1A', line: 'rgba(26,26,26,0.45)', faint: 'rgba(26,26,26,0.1)',
  // WDD palette: grass for the house, mud (orange) for the heat pump, yellow for the probe
  house: '#42754F', houseDim: '#35603F', pac: '#AB572E', probe: '#FFD94F',
}

/** Plays the four loop phases once the target scrolls into view (all at once with reduced motion). */
export function useLoopPhase(ref: React.RefObject<Element | null>) {
  // Low threshold: on phones the section is much taller than the screen
  const inView = useInView(ref, {once: true, amount: 0.2})
  const reduce = useReducedMotion()
  const [rawPhase, setPhase] = useState(0)
  const phase = reduce ? (inView ? 4 : 0) : rawPhase

  useEffect(() => {
    if (!inView || reduce) return
    const timers = LOOP_PHASE_AT.slice(1).map((ms, i) => setTimeout(() => setPhase(i + 1), ms))
    return () => timers.forEach(clearTimeout)
  }, [inView, reduce])

  return {phase, reduce: !!reduce}
}

/** The closed-loop cross-section. Fills its box: give it a height (stretch in a grid) or keep the default aspect ratio. */
export function GroundLoopDiagram({phase, reduce, label, className = 'aspect-[400/540] lg:aspect-auto'}: {phase: number; reduce: boolean; label: string; className?: string}) {
  // Unique ids: a page can hold two diagrams (desktop + phone), one of them hidden
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  // Track the drawing box so the ground fills the column and the height matches the text
  const boxRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({w: 400, h: 540})
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const {width, height} = entry.contentRect
      if (width > 0 && height > 0) setBox({w: Math.round(width), h: Math.round(height)})
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const {w: W, h: H} = box
  const scale = Math.max(0.6, Math.min(W / 400, (H * 0.3) / (HOUSE.ground - HOUSE.top)))
  const groundY = 8 + (HOUSE.ground - HOUSE.top) * scale
  const houseX = W / 2 - HOUSE.centerX * scale
  const probeX = houseX + HOUSE.probeX * scale
  const probeBottom = H - 24
  const pacBottom = groundY - (HOUSE.ground - HOUSE.pacY - HOUSE.pacH) * scale
  const depthY = (d: number) => groundY + (d / 150) * (probeBottom - groundY)
  const stratum = (y: number) => `M0 ${y} C ${W * 0.25} ${y - 8}, ${W * 0.5} ${y + 10}, ${W * 0.75} ${y - 2} S ${W} ${y + 2}, ${W} ${y + 2}`

  const draw = (on: boolean, duration: number) => ({
    initial: {pathLength: 0},
    animate: {pathLength: on ? 1 : 0},
    transition: {duration: reduce ? 0 : duration, ease: 'easeInOut' as const},
  })

  return (
  <div ref={boxRef} className={`relative w-full ${className}`}>
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`${uid}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D3CBBC" />
          <stop offset="1" stopColor="#C2B8A6" />
        </linearGradient>
        <filter id={`${uid}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      {/* Ground and strata, full column width */}
      <rect x="0" y={groundY} width={W} height={H - groundY} fill={`url(#${uid}-ground)`} fillOpacity="0.55" />
      <rect x="0" y={groundY} width={W} height={H - groundY} filter={`url(#${uid}-grain)`} opacity="0.12" style={{mixBlendMode: 'multiply'}} />
      <path d={stratum(depthY(52))} stroke={C.faint} fill="none" />
      <path d={stratum(depthY(105))} stroke={C.faint} fill="none" />

      {/* Depth scale */}
      {[0, 50, 100, 150].map(d => {
        const y = depthY(d)
        return (
          <g key={d}>
            <line x1="0" x2="12" y1={y} y2={y} stroke={C.line} />
            <text x="18" y={d === 0 ? y + 14 : y + 4} fontSize="11" fill={C.ink} fillOpacity="0.5">{d} m</text>
          </g>
        )
      })}

      {/* Closed probe loop */}
      <g stroke={C.probe} strokeWidth="2" fill="none">
        <motion.path d={`M${probeX - 5} ${groundY} V${probeBottom}`} {...draw(phase >= 1, 2.4)} />
        <motion.path d={`M${probeX + 5} ${groundY} V${probeBottom}`} {...draw(phase >= 1, 2.4)} />
        <motion.path
          d={`M${probeX - 5} ${probeBottom} Q${probeX} ${probeBottom + 10} ${probeX + 5} ${probeBottom}`}
          initial={{opacity: 0}}
          animate={{opacity: phase >= 2 ? 1 : 0}}
        />
      </g>

      {/* Fluid circulating in the loop: down one leg, back up the other */}
      {phase >= 2 && [0, 1, 2].map(i => (
        <g key={i}>
          <motion.circle
            cx={probeX - 5}
            r="2.5"
            fill={C.probe}
            initial={{cy: groundY, opacity: 0}}
            animate={reduce ? {cy: depthY(50), opacity: 1} : {cy: [groundY, probeBottom], opacity: [0, 1, 1, 0]}}
            transition={reduce ? {duration: 0} : {duration: 3.6, delay: i * 1.2, repeat: Infinity, ease: 'linear'}}
          />
          <motion.circle
            cx={probeX + 5}
            r="2.5"
            fill={C.probe}
            initial={{cy: probeBottom, opacity: 0}}
            animate={reduce ? {cy: depthY(100), opacity: 1} : {cy: [probeBottom, groundY], opacity: [0, 1, 1, 0]}}
            transition={reduce ? {duration: 0} : {duration: 3.6, delay: i * 1.2, repeat: Infinity, ease: 'linear'}}
          />
        </g>
      ))}

      {/* House silhouette (main gable + lower annex holding the heat pump), kept in proportion */}
      <g transform={`translate(${houseX} ${groundY - HOUSE.ground * scale}) scale(${scale})`}>
        <path
          d={`M120 ${HOUSE.ground} V128 L180 72 L240 128 V152 L300 178 V${HOUSE.ground} Z`}
          fill={C.house}
          stroke={C.house}
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <motion.rect
          x={HOUSE.probeX - 10} y={HOUSE.pacY} width="20" height={HOUSE.pacH} rx="2"
          initial={false}
          animate={{fill: phase >= 3 ? C.pac : C.houseDim}}
          transition={{duration: 0.8}}
        />

        {/* Inside, once the heat pump runs: underfloor heating on the ground floor
            (screed lines, heating pipe, rising heat), shower hot water and radiator upstairs */}
        <line x1="126" x2="236" y1="158" y2="158" stroke={C.houseDim} strokeWidth="2" />

        <g stroke={C.houseDim} strokeWidth="1.5" strokeLinecap="round" fill="none">
          <line x1="128" x2="232" y1="187" y2="187" />
          <line x1="128" x2="232" y1="197" y2="197" />
          <path d={FLOOR_PIPE} />
        </g>
        <g stroke={C.probe} strokeWidth="1.5" strokeLinecap="round" fill="none">
          <motion.line x1="128" x2="232" y1="187" y2="187" {...draw(phase >= 4, 0.8)} />
          <motion.line x1="128" x2="232" y1="197" y2="197" {...draw(phase >= 4, 0.8)} />
          <motion.path d={FLOOR_PIPE} {...draw(phase >= 4, 1.2)} />
        </g>
        {phase >= 4 && [155, 180, 205].map((x, i) => (
          <motion.g
            key={x}
            stroke={C.probe} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
            initial={{opacity: 0, y: 4}}
            animate={reduce ? {opacity: 1, y: 0} : {opacity: [0, 1, 1, 0], y: [4, 0, -3, -6]}}
            transition={reduce ? {duration: 0} : {duration: 2.4, delay: 0.8 + i * 0.3, repeat: Infinity, ease: 'easeOut'}}
          >
            <path d={`M${x} 183 c -2.5 -3.5 2.5 -5 0 -8.5 c -2.5 -3.5 2.5 -5 0 -8.5`} />
            <path d={`M${x - 3} 169 L${x} 165.5 L${x + 3} 169`} />
          </motion.g>
        ))}

        {/* Shower, upstairs */}
        <g stroke={C.houseDim} strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M134 131 H152 V136" />
        </g>
        <motion.rect x="145" y="136" width="14" height="3" rx="1" initial={false} animate={{fill: phase >= 4 ? C.probe : C.houseDim}} transition={{duration: 0.6, delay: reduce ? 0 : 0.4}} />
        {phase >= 4 && [0, 1, 2].map(i => (
          <motion.line
            key={i}
            x1={147 + i * 5} x2={147 + i * 5}
            stroke={C.probe} strokeWidth="1.5" strokeLinecap="round"
            initial={{y1: 142, y2: 146, opacity: 0}}
            animate={reduce ? {y1: 144, y2: 148, opacity: 1} : {y1: [142, 150], y2: [146, 154], opacity: [0, 1, 0]}}
            transition={reduce ? {duration: 0} : {duration: 0.9, delay: 0.5 + i * 0.25, repeat: Infinity, ease: 'linear'}}
          />
        ))}

        <motion.rect
          x="206" y="136" width="22" height="15" rx="1.5"
          initial={false}
          animate={{fill: phase >= 4 ? C.probe : C.houseDim}}
          transition={{duration: 0.8, delay: reduce ? 0 : 0.9}}
        />
        <g stroke={C.house} strokeWidth="1">
          <line x1="211.5" x2="211.5" y1="138" y2="149" />
          <line x1="217" x2="217" y1="138" y2="149" />
          <line x1="222.5" x2="222.5" y1="138" y2="149" />
        </g>
      </g>

      {/* Probe rises through the slab into the heat pump */}
      <g stroke={C.probe} strokeWidth="2" fill="none">
        <motion.path d={`M${probeX - 5} ${groundY} V${pacBottom}`} {...draw(phase >= 3, 0.6)} />
        <motion.path d={`M${probeX + 5} ${groundY} V${pacBottom}`} {...draw(phase >= 3, 0.6)} />
      </g>
    </svg>
  </div>
  )
}

/**
 * Phones only: the steps play over four screens of scroll. The diagram stays pinned and
 * builds one phase per step, the current step reads above it, the CTA stays visible.
 */
export function MobileScrollSteps({steps, label, ctaHref, ctaLabel}: {
  steps: {title?: string; body?: string}[]
  label: string
  ctaHref: string
  ctaLabel: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = !!useReducedMotion()
  const {scrollYProgress} = useScroll({target: ref, offset: ['start start', 'end end']})
  const [step, setStep] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', p => {
    setStep(Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length))))
  })

  if (reduce) {
    return (
      <div className="lg:hidden mt-10">
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-wdd-yellow text-wdd-black flex items-center justify-center text-sm font-bold">{i + 1}</span>
              <div>
                {s.title && <div className="font-bold leading-snug">{s.title}</div>}
                {s.body && <div className="text-sm font-light text-black/60 leading-6 mt-1">{s.body}</div>}
              </div>
            </li>
          ))}
        </ol>
        <GroundLoopDiagram phase={4} reduce label={label} className="mt-8 aspect-[400/540]" />
        <ContactCta href={ctaHref} label={ctaLabel} className="mt-8" />
      </div>
    )
  }

  const current = steps[step]
  return (
    <div ref={ref} className="lg:hidden relative mt-6" style={{height: `${steps.length * 100}svh`}}>
      <div className="sticky top-16 h-[calc(100svh-4rem)] flex flex-col pt-4 pb-24">
        <div className="flex items-center gap-2 mb-3">
          {steps.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-6 bg-wdd-black' : i < step ? 'w-1.5 bg-wdd-black/60' : 'w-1.5 bg-black/15'}`} />
          ))}
        </div>
        <div className="min-h-[7.5rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{opacity: 0, y: 12}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -12}}
              transition={{duration: 0.3, ease: EASE}}
              className="flex gap-4"
            >
              <span className="shrink-0 w-8 h-8 rounded-full bg-wdd-yellow text-wdd-black flex items-center justify-center text-sm font-bold">{step + 1}</span>
              <div>
                {current?.title && <div className="font-bold leading-snug">{current.title}</div>}
                {current?.body && <div className="text-sm font-light text-black/65 leading-6 mt-1">{current.body}</div>}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex-1 min-h-0 mt-3">
          <GroundLoopDiagram phase={step + 1} reduce={false} label={label} className="h-full" />
        </div>
        <ContactCta href={ctaHref} label={ctaLabel} className="mt-4 self-start" />
      </div>
    </div>
  )
}
