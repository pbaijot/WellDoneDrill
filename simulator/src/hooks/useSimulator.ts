'use client'
import { useState } from 'react'
import type { Profile, Answers, AddressResult, LeadType } from '../types'
import type { DrillingAreaResult } from '../components/drilling-area/types'
import { qualifyLead } from '../engine'

export type Phase = 'profile' | 'address' | 'map' | 'geology' | 'drilling-area' | 'questions' | 'result'

type HistoryEntry = { phase: Phase; stepId: string; answers: Answers; drillingArea: DrillingAreaResult | null }

export function useSimulator() {
  const [profile, setProfile]             = useState<Profile>(null)
  const [phase, setPhase]                 = useState<Phase>('profile')
  const [stepId, setStepId]               = useState<string>('type_projet')
  const [answers, setAnswers]             = useState<Answers>({})
  const [address, setAddress]             = useState<AddressResult | null>(null)
  const [drillingArea, setDrillingArea] = useState<DrillingAreaResult | null>(null)
  const [visibleLayers, setVisibleLayers] = useState<string[]>(['captage','pollution','karst','natura','zi','drigm'])
  const [MapComponent, setMapComponent]   = useState<any>(null)
  const [history, setHistory]             = useState<HistoryEntry[]>([])
  const [lead, setLead]                   = useState<LeadType>('conseiller')

  function push(p: Phase, sid?: string) {
    setHistory((h) => [...h, { phase, stepId, answers: { ...answers }, drillingArea }])
    setPhase(p)
    if (sid !== undefined) setStepId(sid)
  }

  function back() {
    const prev = history[history.length - 1]
    if (!prev) return
    setHistory((h) => h.slice(0, -1))
    setPhase(prev.phase)
    setStepId(prev.stepId)
    setAnswers(prev.answers)
    setDrillingArea(prev.drillingArea)
  }

  function chooseProfile(p: Profile) {
    setProfile(p)
    setHistory([])
    setAnswers({})
    setDrillingArea(null)
    push('address', '')
  }

  function handleAddressConfirm(a: AddressResult) {
    setAddress(a)
    import('../components/maps/RegulatoryMap').then((mod) => setMapComponent(() => mod.default))
    push('map', '')
  }

  function handleAnswer(value: string, next: string) {
    const newAnswers = { ...answers, [stepId]: value }
    setAnswers(newAnswers)
    if (next === 'result') {
      const l = qualifyLead(newAnswers)
      setLead(l)
      push('result', '')
    } else {
      push('questions', next)
    }
  }

  function toggleLayer(key: string) {
    setVisibleLayers((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  return {
    profile, phase, stepId, answers, address, drillingArea, visibleLayers, MapComponent, lead,
    toggleLayer, push, back, chooseProfile, handleAddressConfirm, handleAnswer, setDrillingArea,
  }
}
