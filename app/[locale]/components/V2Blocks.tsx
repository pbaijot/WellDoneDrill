'use client'

/* Building blocks shared by the V2 page layouts (Particuliers, Pro). */

import {useState, useRef} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {motion, AnimatePresence, useReducedMotion} from 'framer-motion'

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
