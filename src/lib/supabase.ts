import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL  as string ?? ''
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string ?? ''

// Guard: si no hay credenciales, exportamos un cliente inactivo
// La app funciona normalmente; ContactModal mostrará error al enviar
export const supabase = url && key ? createClient(url, key) : null as any
