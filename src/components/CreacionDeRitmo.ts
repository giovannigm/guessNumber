import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

export function useCreacionDeRitmo() {
  const kickRef = useRef<Tone.MembraneSynth | null>(null)
  const snareRef = useRef<Tone.NoiseSynth | null>(null)
  const hatRef = useRef<Tone.MetalSynth | null>(null)
  const bassRef = useRef<Tone.MonoSynth | null>(null)
  const guitarRef = useRef<Tone.PolySynth | null>(null)
  const brassRef = useRef<Tone.PolySynth | null>(null)
  const kickSeqRef = useRef<Tone.Sequence<number> | null>(null)
  const snareSeqRef = useRef<Tone.Sequence<number> | null>(null)
  const hatLoopRef = useRef<Tone.Loop | null>(null)
  const sectionLoopRef = useRef<Tone.Loop | null>(null)
  const bassSeqRef = useRef<Tone.Sequence<string> | null>(null)
  const guitarSeqRef = useRef<Tone.Sequence<string | null> | null>(null)
  const brassSeqRef = useRef<Tone.Sequence<string | null> | null>(null)

  const [musicaActiva, setMusicaActiva] = useState(false)

  const detenerMusica = () => {
    kickSeqRef.current?.stop(0)
    kickSeqRef.current?.dispose()
    kickSeqRef.current = null

    snareSeqRef.current?.stop(0)
    snareSeqRef.current?.dispose()
    snareSeqRef.current = null

    hatLoopRef.current?.stop(0)
    hatLoopRef.current?.dispose()
    hatLoopRef.current = null

    sectionLoopRef.current?.stop(0)
    sectionLoopRef.current?.dispose()
    sectionLoopRef.current = null

    bassSeqRef.current?.stop(0)
    bassSeqRef.current?.dispose()
    bassSeqRef.current = null

    guitarSeqRef.current?.stop(0)
    guitarSeqRef.current?.dispose()
    guitarSeqRef.current = null

    brassSeqRef.current?.stop(0)
    brassSeqRef.current?.dispose()
    brassSeqRef.current = null

    kickRef.current?.dispose()
    kickRef.current = null

    snareRef.current?.dispose()
    snareRef.current = null

    hatRef.current?.dispose()
    hatRef.current = null

    guitarRef.current?.dispose()
    guitarRef.current = null

    bassRef.current?.dispose()
    bassRef.current = null

    brassRef.current?.dispose()
    brassRef.current = null

    Tone.Transport.stop()
    Tone.Transport.cancel(0)
  }

  const iniciarMusica = async () => {
    if (kickRef.current || bassSeqRef.current) return

    await Tone.start()
    Tone.Transport.stop()
    Tone.Transport.cancel(0)
    Tone.Transport.bpm.value = 168
    Tone.Transport.timeSignature = [4, 4]
    Tone.Transport.swing = 0.04
    Tone.Transport.swingSubdivision = '8n'

    const masterComp = new Tone.Compressor(-18, 3).toDestination()
    const room = new Tone.Reverb({ decay: 1.8, wet: 0.18 }).connect(masterComp)

    const kick = new Tone.MembraneSynth({
      pitchDecay: 0.04,
      octaves: 5,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.22, sustain: 0, release: 0.06 },
      volume: -6,
    }).connect(masterComp)

    const snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.14, sustain: 0, release: 0.05 },
      volume: -12,
    }).connect(masterComp)

    const hat = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.08, release: 0.02 },
      harmonicity: 5.1,
      modulationIndex: 26,
      resonance: 3500,
      octaves: 1.5,
      volume: -22,
    }).connect(masterComp)

    const bass = new Tone.MonoSynth({
      oscillator: { type: 'square4' },
      filter: { Q: 1.8, type: 'lowpass', rolloff: -24 },
      envelope: { attack: 0.01, decay: 0.22, sustain: 0.2, release: 0.2 },
      filterEnvelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.2,
        release: 0.4,
        baseFrequency: 90,
        octaves: 2.4,
      },
      volume: -16,
    }).connect(masterComp)

    const guitar = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.005, decay: 0.12, sustain: 0.05, release: 0.08 },
      volume: -14,
    }).connect(room)

    const brass = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'square' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.28, release: 0.22 },
      volume: -18,
    }).connect(room)

    const estructura = [
      { nombre: 'intro', compases: 4 },
      { nombre: 'verso', compases: 8 },
      { nombre: 'pre', compases: 4 },
      { nombre: 'estribillo', compases: 8 },
      { nombre: 'instrumental', compases: 4 },
      { nombre: 'final', compases: 8 },
    ] as const
    type Seccion = (typeof estructura)[number]['nombre']

    const patadaPorSeccion: Record<Seccion, number[]> = {
      intro: [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
      verso: [1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0],
      pre: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      estribillo: [1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1],
      instrumental: [1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1],
      final: [1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1],
    }

    const snarePorSeccion: Record<Seccion, number[]> = {
      intro: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0],
      verso: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0],
      pre: [0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0],
      estribillo: [0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0],
      instrumental: [0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0],
      final: [0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1],
    }

    const bajoPorSeccion: Record<Seccion, string[]> = {
      intro: ['G2', 'A2', 'B2', 'D3', 'E3', 'D3', 'B2', 'A2', 'G2', 'A2', 'B2', 'D3', 'E3', 'D3', 'B2', 'A2'],
      verso: ['G2', 'B2', 'D3', 'E3', 'D3', 'B2', 'A2', 'G2', 'C3', 'E3', 'G3', 'A2', 'G2', 'E2', 'D2', 'B2'],
      pre: ['E2', 'F#2', 'G2', 'A2', 'B2', 'D3', 'E3', 'F#3', 'G3', 'A3', 'G3', 'E3', 'D3', 'B2', 'A2', 'F#2'],
      estribillo: ['G2', 'A2', 'B2', 'D3', 'E3', 'G3', 'A3', 'G3', 'E3', 'D3', 'B2', 'A2', 'G2', 'B2', 'D3', 'E3'],
      instrumental: ['C3', 'D3', 'E3', 'G3', 'A3', 'G3', 'E3', 'D3', 'B2', 'D3', 'E3', 'G3', 'A2', 'G2', 'E2', 'D2'],
      final: ['G2', 'A2', 'B2', 'D3', 'E3', 'G3', 'A3', 'B3', 'A3', 'G3', 'E3', 'D3', 'B2', 'A2', 'G2', 'D2'],
    }

    const guitarraPorSeccion: Record<Seccion, Array<string | null>> = {
      intro: [null, 'G4,B4,D5', null, 'G4,B4,D5', null, 'E4,G4,B4', null, 'E4,G4,B4', null, 'C4,E4,G4', null, 'C4,E4,G4', null, 'D4,F#4,A4', null, 'D4,F#4,A4'],
      verso: [null, 'G4,B4,D5', null, 'G4,B4,D5', null, 'D4,F#4,A4', null, 'D4,F#4,A4', null, 'E4,G4,B4', null, 'E4,G4,B4', null, 'C4,E4,G4', null, 'D4,F#4,A4'],
      pre: [null, 'E4,G4,B4', null, 'E4,G4,B4', null, 'F#4,A4,C5', null, 'F#4,A4,C5', null, 'G4,B4,D5', null, 'G4,B4,D5', null, 'A4,C5,E5', null, 'A4,C5,E5'],
      estribillo: ['G4,D5', null, 'G4,D5', null, 'E4,B4', null, 'E4,B4', null, 'C4,G4', null, 'C4,G4', null, 'D4,A4', null, 'D4,A4', null],
      instrumental: [null, 'C5,E5,G5', null, 'D5,F#5,A5', null, 'E5,G5,B5', null, 'D5,F#5,A5', null, 'C5,E5,G5', null, 'B4,D5,G5', null, 'A4,C5,E5', null, 'D5,F#5,A5'],
      final: ['G4,D5', null, 'G4,D5', null, 'E4,B4', null, 'E4,B4', null, 'C4,G4', null, 'C4,G4', null, 'D4,A4', null, 'D4,A4', null],
    }

    const vientosPorSeccion: Record<Seccion, Array<string | null>> = {
      intro: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
      verso: [null, null, null, null, 'D5', null, null, null, 'E5', null, null, null, 'G5', null, null, null],
      pre: [null, null, 'D5', 'E5', null, null, 'F#5', 'G5', null, null, 'A5', 'G5', null, 'E5', 'D5', null],
      estribillo: ['G5', null, 'A5', null, 'B5', null, 'A5', null, 'G5', null, 'E5', null, 'D5', null, 'E5', null],
      instrumental: ['D5', 'E5', 'G5', null, 'A5', 'G5', 'E5', null, 'D5', 'E5', 'B4', null, 'A4', 'B4', 'D5', null],
      final: ['G5', null, 'A5', null, 'B5', null, 'A5', null, 'G5', null, 'E5', null, 'D5', 'E5', 'G5', 'A5'],
    }

    let indiceSeccion = 0
    let compasActual = 0
    let seccionActual: Seccion = estructura[0].nombre

    const sectionLoop = new Tone.Loop(() => {
      compasActual += 1
      if (compasActual >= estructura[indiceSeccion].compases) {
        compasActual = 0
        indiceSeccion = (indiceSeccion + 1) % estructura.length
        seccionActual = estructura[indiceSeccion].nombre
      }
    }, '1m')
    sectionLoop.start(0)

    let pasoKick = 0
    const kickSeq = new Tone.Sequence(
      time => {
        const patron = patadaPorSeccion[seccionActual]
        if (patron[pasoKick % 16]) {
          kick.triggerAttackRelease('C1', '8n', time, 0.95)
        }
        pasoKick += 1
      },
      Array.from({ length: 16 }, () => 1),
      '8n',
    )
    kickSeq.loop = true
    kickSeq.start(0)

    let pasoSnare = 0
    const snareSeq = new Tone.Sequence(
      time => {
        const patron = snarePorSeccion[seccionActual]
        if (patron[pasoSnare % 16]) {
          snare.triggerAttackRelease('16n', time, 0.85)
        }
        pasoSnare += 1
      },
      Array.from({ length: 16 }, () => 1),
      '8n',
    )
    snareSeq.loop = true
    snareSeq.start(0)

    let pasoBajo = 1
    const bassSeq = new Tone.Sequence(
      time => {
        const linea = bajoPorSeccion[seccionActual]
        const note = linea[pasoBajo % 16]
        bass.triggerAttackRelease(note, '8n', time, 0.72)
        pasoBajo += 1
      },
      Array.from({ length: 16 }, () => 'G2'),
      '8n',
    )
    bassSeq.loop = true
    bassSeq.humanize = '64n'
    bassSeq.start(0)

    let pasoGuitarra = 0
    const guitarSeq = new Tone.Sequence<string | null>(
      time => {
        const acordes = guitarraPorSeccion[seccionActual]
        const acorde = acordes[pasoGuitarra % 16]
        if (acorde) {
          guitar.triggerAttackRelease(acorde.split(','), '16n', time, 0.55)
        }
        pasoGuitarra += 1
      },
      Array.from({ length: 16 }, () => null),
      '8n',
    )
    guitarSeq.loop = true
    guitarSeq.humanize = '128n'
    guitarSeq.start(0)

    let pasoVientos = 0
    const brassSeq = new Tone.Sequence<string | null>(
      time => {
        const linea = vientosPorSeccion[seccionActual]
        const note = linea[pasoVientos % 16]
        if (note) {
          brass.triggerAttackRelease(note, '8n', time, 0.6)
        }
        pasoVientos += 1
      },
      Array.from({ length: 16 }, () => null),
      '8n',
    )
    brassSeq.loop = true
    brassSeq.start(0)

    let hhPaso = 0
    const hatLoop = new Tone.Loop(time => {
      const velBase = seccionActual === 'estribillo' || seccionActual === 'final' ? 0.28 : 0.2
      const vel = hhPaso % 2 === 0 ? velBase - 0.07 : velBase
      hat.triggerAttackRelease('16n', time, vel)
      hhPaso += 1
    }, '8n')
    hatLoop.start(0)

    kickRef.current = kick
    snareRef.current = snare
    hatRef.current = hat
    bassRef.current = bass
    guitarRef.current = guitar
    brassRef.current = brass
    kickSeqRef.current = kickSeq
    snareSeqRef.current = snareSeq
    hatLoopRef.current = hatLoop
    sectionLoopRef.current = sectionLoop
    bassSeqRef.current = bassSeq
    guitarSeqRef.current = guitarSeq
    brassSeqRef.current = brassSeq

    Tone.Transport.start()
  }

  const alternarMusica = async () => {
    if (musicaActiva) {
      detenerMusica()
      setMusicaActiva(false)
      return
    }

    await iniciarMusica()
    setMusicaActiva(true)
  }

  useEffect(() => {
    return () => {
      detenerMusica()
    }
  }, [])

  return { musicaActiva, setMusicaActiva, iniciarMusica, detenerMusica, alternarMusica }
}
