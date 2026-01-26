import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

console.log('🔧 Configurando Supabase:', {
  hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
  hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  urlPreview: supabaseUrl.substring(0, 50) + '...',
  url: supabaseUrl,
  keyPreview: supabaseAnonKey.substring(0, 30) + '...'
});

// Validar que las credenciales no sean placeholders
if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  console.error('❌ ERROR: Las credenciales de Supabase son placeholders. Verifica tu archivo .env');
  console.error('❌ Necesitas configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
}

// Configuración con manejo mejorado de errores de conexión
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: false, // Desactivado para evitar loops cuando el proyecto no existe
    detectSessionInUrl: true,
  },
});
