import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Phase = 'idle' | 'analyzing' | 'planning' | 'executing' | 'completed' | 'done'

const CHIPS = [
  'Responde los emails de soporte de hoy',
  'Genera un reporte de ventas semanal',
  'Encuentra leads en LinkedIn para mi producto',
  'Programa 5 posts para esta semana',
]

const RESULTS: Record<string, string> = {
  'Responde los emails de soporte de hoy':
    '12 emails respondidos · 3 tickets cerrados · Tiempo promedio: 1.8 min/email',
  'Genera un reporte de ventas semanal':
    'Reporte listo · $48.3K en ventas · +23% vs semana anterior · PDF en tu Drive',
  'Encuentra leads en LinkedIn para mi producto':
    '47 leads calificados · 8 decisores de compra identificados · Lista en tu CRM',
  'Programa 5 posts para esta semana':
    '5 posts creados y programados · Lun a Vie · Optimizados por horario de audiencia',
}

const STEPS: Partial<Record<Phase, string>> = {
  analyzing: '🔍 Analizando tu comando...',
  planning: '🧠 Planificando la estrategia...',
  executing: '⚡ Ejecutando en tus herramientas...',
  completed: '✅ ¡Completado!',
}

const TIMINGS: Partial<Record<Phase, number>> = {
  analyzing: 1200,
  planning: 800,
  executing: 2000,
  completed: 3000,
}

const PHASE_ORDER: Phase[] = ['idle', 'analyzing', 'planning', 'executing', 'completed', 'done']

// Pre-computed burst particle data (stable, no re-random on render)
const BURST_COUNT = 14

export default function DemoSection() {
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [activeChip, setActiveChip] = useState<string | null>(null)
  const [bursting, setBursting] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const burstData = useMemo(() =>
    Array.from({ length: BURST_COUNT }, (_, i) => {
      const angle = (i / BURST_COUNT) * Math.PI * 2 + (i % 2 === 0 ? 0.15 : -0.15)
      const distance = 50 + (i * 7) % 45
      const size = 3 + (i * 3) % 6
      return { angle, distance, size, cyan: i % 2 === 0 }
    }), [])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  useEffect(() => { return clearTimers }, [])

  const triggerBurst = () => {
    if (reducedMotion) return
    setBursting(true)
    const id = setTimeout(() => setBursting(false), 700)
    timersRef.current.push(id)
  }

  const runAgent = (command: string) => {
    if (phase !== 'idle' && phase !== 'done') return
    if (!command.trim()) return

    clearTimers()

    if (reducedMotion) {
      setPhase('done')
      return
    }

    const schedule = (phases: Phase[], offsets: number[]) => {
      phases.forEach((p, i) => {
        const id = setTimeout(() => setPhase(p), offsets[i])
        timersRef.current.push(id)
      })
    }

    setPhase('analyzing')
    schedule(
      ['planning', 'executing', 'completed', 'done'],
      [
        TIMINGS.analyzing!,
        TIMINGS.analyzing! + TIMINGS.planning!,
        TIMINGS.analyzing! + TIMINGS.planning! + TIMINGS.executing!,
        TIMINGS.analyzing! + TIMINGS.planning! + TIMINGS.executing! + TIMINGS.completed!,
      ]
    )
  }

  const handleRun = () => {
    if (phase !== 'idle' && phase !== 'done') return
    triggerBurst()
    runAgent(input)
  }

  const handleChip = (chip: string) => {
    if (phase !== 'idle' && phase !== 'done') return
    setInput(chip)
    setActiveChip(chip)
    triggerBurst()
    runAgent(chip)
  }

  const handleReset = () => {
    clearTimers()
    setPhase('idle')
    setInput('')
    setActiveChip(null)
  }

  const isRunning = phase !== 'idle' && phase !== 'done'
  const resultKey = activeChip ?? input
  const result = RESULTS[resultKey] ?? RESULTS[CHIPS[0]]

  return (
    <section id="demo" className="py-24 px-4 relative" style={{ background: 'rgba(3,3,14,0.9)' }}>
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,255,0.07) 0%, transparent 65%)' }}
      />

      <div className="max-w-3xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block text-xs font-bold tracking-widest mb-4 px-4 py-1.5 rounded-full font-orbitron"
            style={{ color: '#00ffff', background: 'rgba(0,255,255,0.07)', border: '1px solid rgba(0,255,255,0.2)' }}
          >
            DEMO EN VIVO
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold font-orbitron text-glow-cyan mb-2"
            style={{ color: '#00ffff' }}
          >
            Probá tu primer agente
          </h2>
          <div className="neon-line mx-auto mb-4" style={{ width: 80 }} />
          <p style={{ color: 'rgba(255,255,255,0.45)' }}>
            Seleccioná un comando o escribí el tuyo. Mirá cómo actúa.
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl shadow-2xl transition-all duration-500 p-8 md:p-10"
          animate={{
            borderColor: isRunning ? 'rgba(0,255,255,0.55)' : 'rgba(0,255,255,0.40)',
            boxShadow: isRunning
              ? '0 0 100px -8px rgba(0,255,255,0.40), 0 25px 60px rgba(0,0,0,0.7)'
              : '0 0 80px -10px rgba(0,255,255,0.30), 0 25px 60px rgba(0,0,0,0.6)',
          }}
          style={{ border: '1px solid rgba(0,255,255,0.40)' }}
        >
          {/* Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CHIPS.map((chip) => (
              <motion.button
                key={chip}
                onClick={() => handleChip(chip)}
                disabled={isRunning}
                whileHover={!isRunning ? { scale: 1.05, y: -2 } : {}}
                whileTap={!isRunning ? { scale: 0.97 } : {}}
                className="text-sm px-4 py-2 rounded-full transition-all duration-200"
                animate={{
                  background: activeChip === chip
                    ? 'rgba(0,255,255,0.18)'
                    : 'rgba(255,255,255,0.05)',
                  borderColor: activeChip === chip
                    ? 'rgba(0,255,255,0.6)'
                    : 'rgba(255,255,255,0.12)',
                  color: activeChip === chip ? '#00ffff' : 'rgba(255,255,255,0.6)',
                  boxShadow: activeChip === chip
                    ? '0 0 20px rgba(0,255,255,0.25)'
                    : '0 0 0 rgba(0,0,0,0)',
                }}
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  opacity: isRunning && activeChip !== chip ? 0.4 : 1,
                }}
              >
                {chip}
              </motion.button>
            ))}
          </div>

          {/* Input + Button — with burst overlay */}
          <div className="relative mb-8">
            <div className="flex gap-3">
              <motion.input
                type="text"
                maxLength={150}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRun()}
                disabled={isRunning}
                placeholder="O escribí tu propio comando..."
                className="flex-1 rounded-xl px-4 py-3 text-sm text-white outline-none"
                animate={{
                  borderColor: isRunning
                    ? 'rgba(0,255,255,0.55)'
                    : 'rgba(255,255,255,0.12)',
                  boxShadow: isRunning
                    ? '0 0 20px rgba(0,255,255,0.22), inset 0 0 12px rgba(0,255,255,0.05)'
                    : '0 0 0 rgba(0,0,0,0)',
                }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  opacity: isRunning ? 0.7 : 1,
                  transition: 'all 0.3s',
                }}
              />
              <motion.button
                onClick={handleRun}
                disabled={isRunning || !input.trim()}
                className="btn-primary"
                whileHover={!isRunning && !!input.trim() ? { scale: 1.07 } : {}}
                whileTap={!isRunning ? { scale: 0.97 } : {}}
              >
                Ejecutar
              </motion.button>
            </div>

            {/* Burst particles */}
            <AnimatePresence>
              {bursting && (
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
                  {burstData.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        left: 'calc(100% - 52px)',
                        top: '50%',
                        width: p.size,
                        height: p.size,
                        scale: 1,
                        opacity: 1,
                      }}
                      animate={{
                        left: `calc(100% - 52px + ${Math.cos(p.angle) * p.distance}px)`,
                        top: `calc(50% + ${Math.sin(p.angle) * p.distance}px)`,
                        scale: 0,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.5 + (i % 3) * 0.1, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        borderRadius: '50%',
                        background: p.cyan ? '#00ffff' : '#ff00ff',
                        boxShadow: p.cyan ? '0 0 8px #00ffff' : '0 0 8px #ff00ff',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Phase display */}
          <div className="relative min-h-[100px] flex items-center justify-center overflow-hidden rounded-2xl">
            {/* Scan line during execution */}
            <AnimatePresence>
              {isRunning && (
                <motion.div
                  key="scanline"
                  initial={{ top: '-2px', opacity: 0 }}
                  animate={{ top: ['0%', '100%'], opacity: [0, 0.8, 0.8, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.8), transparent)',
                    pointerEvents: 'none',
                    zIndex: 5,
                  }}
                />
              )}
            </AnimatePresence>

            {/* Energy corner accents when running */}
            {isRunning && (
              <>
                {[0, 1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0.5], scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    style={{
                      position: 'absolute',
                      width: 12, height: 12,
                      ...(i === 0 ? { top: 0, left: 0, borderTop: '2px solid #00ffff', borderLeft: '2px solid #00ffff' } :
                         i === 1 ? { top: 0, right: 0, borderTop: '2px solid #00ffff', borderRight: '2px solid #00ffff' } :
                         i === 2 ? { bottom: 0, left: 0, borderBottom: '2px solid #00ffff', borderLeft: '2px solid #00ffff' } :
                                   { bottom: 0, right: 0, borderBottom: '2px solid #00ffff', borderRight: '2px solid #00ffff' }),
                    }}
                  />
                ))}
              </>
            )}

            <AnimatePresence mode="wait">
              {phase === 'idle' && (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}
                >
                  El agente está listo y esperando...
                </motion.p>
              )}

              {(phase === 'analyzing' || phase === 'planning' || phase === 'executing' || phase === 'completed') && (
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 16, scale: 0.93 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.93 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center w-full"
                >
                  <motion.p
                    className="text-lg font-semibold mb-2"
                    style={{ color: phase === 'completed' ? '#00ffff' : 'rgba(255,255,255,0.85)' }}
                    animate={phase === 'completed' ? { textShadow: ['0 0 10px rgba(0,255,255,0)', '0 0 30px rgba(0,255,255,0.8)', '0 0 10px rgba(0,255,255,0.3)'] } : {}}
                    transition={{ duration: 0.8, repeat: phase === 'completed' ? 2 : 0 }}
                  >
                    {STEPS[phase]}
                  </motion.p>

                  {phase !== 'completed' && (
                    <div className="flex justify-center gap-2 mt-3">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
                          transition={{ duration: 1.0, repeat: Infinity, delay: i * 0.15 }}
                          style={{
                            display: 'inline-block',
                            width: 5, height: 5,
                            borderRadius: '50%',
                            background: i % 2 === 0 ? '#00ffff' : '#ff00ff',
                            boxShadow: i % 2 === 0 ? '0 0 6px #00ffff' : '0 0 6px #ff00ff',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Progress bar */}
                  <div
                    className="mt-4 rounded-full overflow-hidden mx-auto"
                    style={{ height: 3, width: 220, background: 'rgba(255,255,255,0.08)' }}
                  >
                    <motion.div
                      animate={{
                        width:
                          phase === 'analyzing' ? '25%' :
                          phase === 'planning' ? '55%' :
                          phase === 'executing' ? '85%' : '100%',
                      }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #00ffff, #ff00ff)',
                        borderRadius: 9999,
                        boxShadow: '0 0 10px rgba(0,255,255,0.6)',
                      }}
                    />
                  </div>

                  {/* Phase labels */}
                  <div className="flex justify-between mt-1.5 mx-auto" style={{ width: 220 }}>
                    {PHASE_ORDER.slice(1, 5).map((p) => (
                      <span
                        key={p}
                        style={{
                          fontSize: '0.58rem',
                          color: PHASE_ORDER.indexOf(p) <= PHASE_ORDER.indexOf(phase)
                            ? 'rgba(0,255,255,0.75)'
                            : 'rgba(255,255,255,0.2)',
                          fontWeight: PHASE_ORDER.indexOf(p) === PHASE_ORDER.indexOf(phase) ? 700 : 400,
                          transition: 'color 0.3s',
                        }}
                      >
                        {p === 'analyzing' ? 'Análisis' : p === 'planning' ? 'Plan' : p === 'executing' ? 'Ejecución' : 'Listo'}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {phase === 'done' && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center w-full"
                >
                  <motion.div
                    className="bg-white/5 backdrop-blur-2xl border rounded-3xl px-6 py-4 mb-5 text-left"
                    initial={{ borderColor: 'rgba(0,255,255,0.1)' }}
                    animate={{ borderColor: ['rgba(0,255,255,0.1)', 'rgba(0,255,255,0.6)', 'rgba(0,255,255,0.3)'] }}
                    transition={{ duration: 0.8 }}
                    style={{ boxShadow: '0 0 50px -12px rgba(0,255,255,0.30)' }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: 'rgba(0,255,255,0.6)' }}
                    >
                      Resultado del agente
                    </p>
                    <p className="text-base font-medium" style={{ color: '#fff' }}>
                      {result}
                    </p>
                  </motion.div>
                  <motion.button
                    onClick={handleReset}
                    className="btn-secondary text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    ↺ Intentar otro
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
