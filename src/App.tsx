import { lazy, Suspense, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import DemoSection from './components/DemoSection'
import ContactModal from './components/ContactModal'

const NeuralNetwork3D = lazy(() => import('./components/NeuralNetwork3D'))

// ── Framer Motion variants ─────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STAGGER: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CARD: any = {
  hidden: { opacity: 0, y: 50, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SLIDE_LEFT: any = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SLIDE_RIGHT: any = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const sectionHead = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
})

// ── Glassmorphism tokens ───────────────────────────────────────────────────
const G = 'bg-white/5 backdrop-blur-2xl border border-cyan-400/20 hover:border-cyan-400/55 rounded-3xl shadow-2xl transition-all duration-300'
const G_CYAN = 'bg-white/[0.04] backdrop-blur-2xl border border-cyan-400/40 hover:border-cyan-400/70 rounded-3xl shadow-2xl transition-all duration-300'
const G_FLOAT = 'bg-black/40 backdrop-blur-2xl border border-cyan-400/25 hover:border-cyan-400/55 rounded-3xl shadow-2xl transition-all duration-300'
const CARD_SHADOW = { boxShadow: '0 0 35px -8px rgba(0,255,255,0.18), 0 25px 50px rgba(0,0,0,0.65)' }

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPlan, setModalPlan] = useState('Pro')
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  const openModal = (plan: string) => { setModalPlan(plan); setModalOpen(true) }

  return (
    <div style={{ background: '#050510', minHeight: '100vh' }}>

      {/* ── Nav ─────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: 'rgba(5,5,16,0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(0,255,255,0.10)',
          boxShadow: '0 4px 30px rgba(0,255,255,0.05)',
        }}
      >
        <motion.span
          className="font-orbitron font-black text-lg tracking-widest text-glow-cyan neon-flicker"
          style={{ color: '#00ffff', letterSpacing: '0.12em' }}
          whileHover={{ scale: 1.05 }}
        >
          AGENTIC.IA
        </motion.span>
        <motion.button
          className="btn-primary text-sm py-2 px-5"
          onClick={() => openModal('Starter')}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
        >
          Solicitar demo
        </motion.button>
      </motion.nav>

      {/* ── Hero ────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '100vh', paddingTop: 80 }}
      >
        {/* Background radial glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0,255,255,0.11) 0%, transparent 55%),' +
              'radial-gradient(ellipse 70% 55% at 100% 100%, rgba(255,0,255,0.11) 0%, transparent 55%),' +
              'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(0,80,255,0.07) 0%, transparent 60%)',
          }}
        />

        {/* 3D Neural Network */}
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
            <div style={{ width: 48, height: 48, border: '2px solid rgba(0,255,255,0.15)', borderTopColor: '#00ffff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        }>
          <NeuralNetwork3D />
        </Suspense>

        {/* Hero text — scroll parallax */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          style={{ y: heroTextY, opacity: heroTextOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="font-orbitron font-black text-glow-cyan text-gradient-cyan neon-flicker mb-6"
              style={{ fontSize: 'clamp(3.2rem, 11vw, 7.5rem)', letterSpacing: '0.05em', lineHeight: 1.02 }}
            >
              AGENTIC.IA
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 0, scaleX: 0 }}
            animate={{ opacity: 1, y: 0, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="neon-line mx-auto mb-6"
            style={{ width: 120 }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-orbitron font-semibold mb-4"
            style={{ fontSize: 'clamp(1.15rem, 2.8vw, 1.9rem)', color: 'rgba(255,255,255,0.92)' }}
          >
            Agentes IA que actúan por ti.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mb-10 max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.50)', fontSize: '1.05rem', lineHeight: 1.7 }}
          >
            Crea, entrena y despliega agentes autónomos solo con comandos. Sin código.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <motion.a
              href="#demo"
              className="btn-primary text-base px-9 py-4 inline-block"
              whileHover={{ scale: 1.07, boxShadow: '0 0 40px rgba(0,255,255,0.4)' } as any}
              whileTap={{ scale: 0.97 }}
            >
              Crear mi primer agente →
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Floating glass stats */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05, y: -4 }}
          className={`animate-float ${G_FLOAT} absolute hidden lg:block`}
          style={{
            top: '22%', left: '5%',
            padding: '1rem 1.5rem', minWidth: 185,
            boxShadow: '0 0 40px -10px rgba(0,255,255,0.22), 0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.68rem', marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Agente de ventas</p>
          <p className="font-orbitron font-black text-glow-cyan" style={{ color: '#00ffff', fontSize: '1.6rem' }}>hasta 3x</p>
          <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: '0.73rem' }}>más leads calificados</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05, y: -4 }}
          className={`animate-float2 ${G_FLOAT} absolute hidden lg:block`}
          style={{
            bottom: '22%', right: '5%',
            padding: '1rem 1.5rem', minWidth: 205,
            boxShadow: '0 0 40px -10px rgba(255,0,255,0.22), 0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.68rem', marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tiempo ahorrado</p>
          <p className="font-orbitron font-black text-glow-magenta" style={{ color: '#ff00ff', fontSize: '1.6rem' }}>hasta 20h</p>
          <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: '0.73rem' }}>semanales recuperadas</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05, y: -4 }}
          className={`animate-float ${G_FLOAT} absolute hidden xl:block`}
          style={{
            top: '62%', left: '4%',
            padding: '1rem 1.5rem', minWidth: 175, animationDelay: '2s',
            boxShadow: '0 0 40px -10px rgba(0,255,255,0.18), 0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.68rem', marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Disponibilidad</p>
          <p className="font-orbitron font-black text-glow-cyan" style={{ color: '#00ffff', fontSize: '1.6rem' }}>24/7</p>
          <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: '0.73rem' }}>sin intervención humana</p>
        </motion.div>
      </section>

      {/* ── What is an AI Agent ─────────────────────── */}
      <section className="py-24 px-4 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,0,255,0.04) 0%, transparent 70%)' }}
        />
        <div className="max-w-5xl mx-auto relative">
          <motion.h2 {...sectionHead()} className="text-3xl md:text-4xl font-bold font-orbitron text-center text-glow-cyan mb-2" style={{ color: '#00ffff' }}>
            ¿Qué es un agente IA?
          </motion.h2>
          <motion.div {...sectionHead(0.05)} className="neon-line mx-auto mb-4" style={{ width: 80 }} />
          <motion.p {...sectionHead(0.1)} className="text-center mb-12" style={{ color: 'rgba(255,255,255,0.45)' }}>
            No es un chatbot. Es un colaborador digital que ejecuta tareas reales.
          </motion.p>

          <motion.div
            variants={STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div
              variants={SLIDE_LEFT}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`${G} p-8`}
              style={CARD_SHADOW}
            >
              <h3 className="text-base font-bold mb-5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                🤖 Chatbot tradicional
              </h3>
              <ul className="space-y-3">
                {['Solo responde preguntas', 'No recuerda el contexto', 'No ejecuta acciones reales', 'Requiere supervisión constante'].map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <span style={{ color: 'rgba(255,100,100,0.7)', fontSize: '1rem' }}>✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={SLIDE_RIGHT}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`${G_CYAN} p-8`}
              style={{ boxShadow: '0 0 60px -15px rgba(0,255,255,0.28), 0 25px 50px rgba(0,0,0,0.5)' }}
            >
              <h3 className="text-base font-bold mb-5 text-glow-cyan" style={{ color: '#00ffff' }}>
                ⚡ Agente IA (AGENTIC.IA)
              </h3>
              <ul className="space-y-3">
                {['Ejecuta tareas completas de extremo a extremo', 'Aprende de tu negocio y se adapta', 'Se conecta a tus herramientas existentes', 'Trabaja de forma autónoma, sin interrupciones'].map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    <span style={{ color: '#00ffff' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Workflows ───────────────────────────────── */}
      <section className="py-24 px-4 relative" style={{ background: 'rgba(3,3,14,0.8)' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,255,255,0.06) 0%, transparent 60%)' }}
        />
        <div className="max-w-6xl mx-auto relative">
          <motion.h2 {...sectionHead()} className="text-3xl md:text-4xl font-bold font-orbitron text-center text-glow-cyan mb-2" style={{ color: '#00ffff' }}>
            Agentes listos para tu negocio
          </motion.h2>
          <motion.div {...sectionHead(0.05)} className="neon-line mx-auto mb-4" style={{ width: 80 }} />
          <motion.p {...sectionHead(0.1)} className="text-center mb-12" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Cada agente se especializa en un área clave de tu operación.
          </motion.p>
          <motion.div
            variants={STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: '💼', title: 'Agente de ventas', desc: 'Califica leads, envía follow-ups y agenda reuniones automáticamente.', color: '#00ffff' },
              { icon: '🎧', title: 'Agente de soporte', desc: 'Responde tickets, escala casos urgentes y aprende de cada interacción.', color: '#00c8ff' },
              { icon: '🔍', title: 'Agente de investigación', desc: 'Recolecta datos de mercado, analiza competidores y genera reportes.', color: '#a800ff' },
              { icon: '⚙️', title: 'Agente de automatización', desc: 'Conecta tus apps, elimina tareas repetitivas y optimiza flujos.', color: '#ff00ff' },
            ].map((w, i) => (
              <motion.div
                key={i}
                variants={CARD}
                whileHover={{ y: -8, scale: 1.04, transition: { duration: 0.25 } }}
                className={`${G} p-7 group cursor-default`}
                style={CARD_SHADOW}
              >
                <motion.div
                  className="text-4xl mb-5"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {w.icon}
                </motion.div>
                <h3
                  className="text-sm font-bold mb-3 transition-all duration-300 group-hover:text-glow-cyan"
                  style={{ color: '#fff' }}
                >
                  {w.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.50)' }}>{w.desc}</p>
                <motion.div
                  className="mt-5 h-0.5 rounded-full"
                  initial={{ width: 48 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.4 }}
                  style={{ background: `linear-gradient(90deg, ${w.color}, transparent)` }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Demo ────────────────────────────────────── */}
      <DemoSection />

      {/* ── Benefits ────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...sectionHead()} className="text-3xl md:text-4xl font-bold font-orbitron text-center text-glow-cyan mb-2" style={{ color: '#00ffff' }}>
            Por qué AGENTIC.IA
          </motion.h2>
          <motion.div {...sectionHead(0.05)} className="neon-line mx-auto mb-4" style={{ width: 80 }} />
          <motion.p {...sectionHead(0.1)} className="text-center mb-12" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Diseñado para equipos que quieren hacer más con menos.
          </motion.p>
          <motion.div
            variants={STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
          >
            {[
              { icon: '🧩', title: 'Sin código', desc: 'Configurá y desplegá agentes solo con lenguaje natural.' },
              { icon: '🕐', title: '24/7', desc: 'Tus agentes trabajan mientras dormís, sin pausas.' },
              { icon: '🔗', title: 'Se integra', desc: 'Gmail, Slack, Notion, HubSpot, Sheets y más.' },
              { icon: '📈', title: 'Mejora continua', desc: 'Aprende de cada tarea y se vuelve más preciso.' },
              { icon: '📊', title: 'Dashboard central', desc: 'Todos tus agentes en un solo panel en tiempo real.' },
            ].map((b, i) => (
              <motion.div
                key={i}
                variants={CARD}
                whileHover={{ y: -8, scale: 1.04, transition: { duration: 0.25 } }}
                className={`${G} p-7 text-center group cursor-default`}
                style={CARD_SHADOW}
              >
                <motion.div
                  className="text-3xl mb-4"
                  whileHover={{ scale: 1.3, rotate: -5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {b.icon}
                </motion.div>
                <h3
                  className="text-sm font-bold mb-2 transition-all duration-300 group-hover:text-glow-cyan"
                  style={{ color: '#fff' }}
                >
                  {b.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.48)' }}>{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Use Cases ───────────────────────────────── */}
      <section className="py-24 px-4 relative" style={{ background: 'rgba(3,3,14,0.8)' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,0,255,0.05) 0%, transparent 60%)' }}
        />
        <div className="max-w-6xl mx-auto relative">
          <motion.h2 {...sectionHead()} className="text-3xl md:text-4xl font-bold font-orbitron text-center text-glow-cyan mb-2" style={{ color: '#00ffff' }}>
            Casos de uso reales
          </motion.h2>
          <motion.div {...sectionHead(0.05)} className="neon-line mx-auto mb-4" style={{ width: 80 }} />
          <motion.p {...sectionHead(0.1)} className="text-center mb-12" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Empresas de todos los rubros ya automatizan con AGENTIC.IA.
          </motion.p>
          <motion.div
            variants={STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: '🛒', title: 'E-commerce', items: ['Respuesta automática de consultas', 'Seguimiento de pedidos y devoluciones', 'Reactivación de carritos abandonados'] },
              { icon: '📣', title: 'Agencia de marketing', items: ['Generación de contenido semanal', 'Reportes de campañas automáticos', 'Prospección en redes sociales'] },
              { icon: '💻', title: 'SaaS', items: ['Onboarding automatizado de usuarios', 'Detección de churn temprana', 'Soporte técnico nivel 1'] },
              { icon: '🏢', title: 'Consultoría', items: ['Investigación de mercado exprés', 'Preparación de propuestas', 'Seguimiento de proyectos y plazos'] },
            ].map((uc, i) => (
              <motion.div
                key={i}
                variants={CARD}
                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.25 } }}
                className={`${G} p-7 group cursor-default`}
                style={CARD_SHADOW}
              >
                <motion.div
                  className="text-3xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {uc.icon}
                </motion.div>
                <h3
                  className="text-sm font-bold mb-4 transition-all duration-300 group-hover:text-glow-cyan"
                  style={{ color: '#fff' }}
                >
                  {uc.title}
                </h3>
                <ul className="space-y-2">
                  {uc.items.map((item, j) => (
                    <li key={j} className="text-xs flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.52)' }}>
                      <motion.span
                        style={{ color: '#00ffff', marginTop: 1, flexShrink: 0 }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: j * 0.4 }}
                      >
                        ›
                      </motion.span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────── */}
      <section className="py-24 px-4 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,255,0.06) 0%, transparent 65%)' }}
        />
        <div className="max-w-5xl mx-auto relative">
          <motion.h2 {...sectionHead()} className="text-3xl md:text-4xl font-bold font-orbitron text-center text-glow-cyan mb-2" style={{ color: '#00ffff' }}>
            Planes simples y transparentes
          </motion.h2>
          <motion.div {...sectionHead(0.05)} className="neon-line mx-auto mb-4" style={{ width: 80 }} />
          <motion.p {...sectionHead(0.1)} className="text-center mb-12" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Sin contratos. Cancelás cuando querés.
          </motion.p>

          <motion.div
            variants={STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
          >
            {/* Starter */}
            <motion.div
              variants={CARD}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
              className={`${G} p-8`}
              style={CARD_SHADOW}
            >
              <p className="text-xs font-semibold mb-3 tracking-widest font-orbitron" style={{ color: 'rgba(255,255,255,0.45)' }}>STARTER</p>
              <p className="font-orbitron font-black mb-1" style={{ fontSize: '3rem', color: '#fff', lineHeight: 1 }}>$29</p>
              <p className="text-xs mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>/mes · facturado mensual</p>
              <ul className="space-y-3 mb-8">
                {['3 agentes activos', '500 tareas/mes', 'Integraciones básicas', 'Soporte por email'].map((f, i) => (
                  <li key={i} className="text-sm flex gap-2.5" style={{ color: 'rgba(255,255,255,0.60)' }}>
                    <span style={{ color: '#00ffff' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <motion.button
                className="btn-secondary w-full"
                onClick={() => openModal('Starter')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Empezar ahora
              </motion.button>
            </motion.div>

            {/* Pro — featured */}
            <motion.div
              variants={CARD}
              whileHover={{ y: -10, scale: 1.04, transition: { duration: 0.25 } }}
              className={`${G_CYAN} p-8 relative`}
              style={{
                boxShadow: '0 0 80px -12px rgba(0,255,255,0.35), 0 25px 50px rgba(0,0,0,0.6)',
                transform: 'scale(1.02)',
              }}
            >
              <motion.span
                className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest px-5 py-1.5 rounded-full font-orbitron"
                style={{
                  background: 'rgba(0,255,255,0.12)',
                  border: '1px solid rgba(0,255,255,0.45)',
                  color: '#00ffff',
                  boxShadow: '0 0 24px rgba(0,255,255,0.3)',
                }}
                animate={{ boxShadow: ['0 0 20px rgba(0,255,255,0.2)', '0 0 40px rgba(0,255,255,0.45)', '0 0 20px rgba(0,255,255,0.2)'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                MÁS POPULAR
              </motion.span>
              <p className="text-xs font-semibold mb-3 tracking-widest font-orbitron text-glow-cyan" style={{ color: '#00ffff' }}>PRO</p>
              <p className="font-orbitron font-black mb-1 text-glow-cyan" style={{ fontSize: '3rem', color: '#00ffff', lineHeight: 1 }}>$99</p>
              <p className="text-xs mb-8" style={{ color: 'rgba(0,255,255,0.45)' }}>/mes · facturado mensual</p>
              <ul className="space-y-3 mb-8">
                {['15 agentes activos', '5.000 tareas/mes', 'Todas las integraciones', 'Dashboard avanzado', 'Soporte prioritario'].map((f, i) => (
                  <li key={i} className="text-sm flex gap-2.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    <span style={{ color: '#00ffff' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <motion.button
                className="btn-primary w-full py-4 text-base"
                onClick={() => openModal('Pro')}
                whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,255,255,0.45)' } as any}
                whileTap={{ scale: 0.97 }}
              >
                Empezar ahora →
              </motion.button>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              variants={CARD}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
              className={`${G} p-8`}
              style={CARD_SHADOW}
            >
              <p className="text-xs font-semibold mb-3 tracking-widest font-orbitron" style={{ color: 'rgba(255,255,255,0.45)' }}>ENTERPRISE</p>
              <p className="font-orbitron font-black mb-1" style={{ fontSize: '2.2rem', color: '#fff', lineHeight: 1.1 }}>Custom</p>
              <p className="text-xs mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>precio a medida</p>
              <ul className="space-y-3 mb-8">
                {['Agentes ilimitados', 'Tareas ilimitadas', 'Onboarding dedicado', 'SLA garantizado', 'Integración a medida'].map((f, i) => (
                  <li key={i} className="text-sm flex gap-2.5" style={{ color: 'rgba(255,255,255,0.60)' }}>
                    <span style={{ color: '#00ffff' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <motion.button
                className="btn-secondary w-full"
                onClick={() => openModal('Enterprise')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Contactar
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-10 text-center"
        style={{
          borderTop: '1px solid rgba(0,255,255,0.08)',
          background: 'rgba(2,2,12,0.9)',
          color: 'rgba(255,255,255,0.28)',
          fontSize: '0.85rem',
        }}
      >
        © 2025 AGENTIC.IA · Desarrollado por{' '}
        <span className="font-semibold" style={{ color: 'rgba(0,255,255,0.55)' }}>
          InteliarStack
        </span>
      </motion.footer>

      <ContactModal
        isOpen={modalOpen}
        plan={modalPlan}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
