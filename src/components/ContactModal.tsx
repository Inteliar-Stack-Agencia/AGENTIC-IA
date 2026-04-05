import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  isOpen: boolean
  plan?: string
  onClose: () => void
}

export default function ContactModal({ isOpen, plan = 'Pro', onClose }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', selectedPlan: plan, message: '' })

  useEffect(() => {
    setForm(f => ({ ...f, selectedPlan: plan }))
  }, [plan])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    if (!supabase) {
      setLoading(false)
      setError('Servicio no configurado. Contactanos a hola@inteliarstack.com')
      return
    }
    const { error: dbError } = await supabase.from('leads').insert({
      name:    form.name,
      email:   form.email,
      plan:    form.selectedPlan,
      message: form.message,
    })
    setLoading(false)
    if (dbError) {
      setError('Error al enviar. Intentá de nuevo.')
      return
    }
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
      setForm({ name: '', email: '', selectedPlan: plan, message: '' })
    }, 2500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(2,2,16,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="glass-cyan w-full max-w-lg p-8"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold font-orbitron text-glow-cyan" style={{ color: '#00ffff' }}>
                  Empezar con AGENTIC.IA
                </h3>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Te contactamos en menos de 24 horas.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors text-lg leading-none mt-1"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🚀</div>
                <p className="text-lg font-semibold mb-1" style={{ color: '#00ffff' }}>
                  ¡Recibido!
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                  Te contactamos muy pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.10)',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(0,255,255,0.4)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="tu@empresa.com"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.10)',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(0,255,255,0.4)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Plan
                  </label>
                  <select
                    value={form.selectedPlan}
                    onChange={e => setForm({ ...form, selectedPlan: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.10)',
                    }}
                  >
                    <option value="Starter">Starter — $29/mes</option>
                    <option value="Pro">Pro — $99/mes</option>
                    <option value="Enterprise">Enterprise — Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    ¿Qué querés automatizar?
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Contanos qué tarea o proceso querés que tu agente maneje..."
                    rows={3}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all resize-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.10)',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(0,255,255,0.4)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)' }}
                  />
                </div>

                {error && (
                  <p className="text-xs text-center" style={{ color: 'rgba(255,100,100,0.85)' }}>{error}</p>
                )}
                <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-4 text-base">
                  {loading ? 'Enviando...' : 'Quiero empezar →'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
