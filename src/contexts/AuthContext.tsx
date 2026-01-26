
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    console.log('🔐 Inicializando autenticación...');
    

    const initAuth = async () => {
      try {
        console.log('🔑 Obteniendo sesión de Supabase...');
        
        // Limpiar sesión almacenada si hay errores de conexión previos
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('❌ Error getting session:', error);
            console.error('❌ Detalles del error:', {
              message: error.message,
              status: error.status,
              name: error.name
            });
            // Si hay error de conexión, limpiar sesión almacenada
            if (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
              console.warn('⚠️ Limpiando sesión almacenada debido a error de conexión');
              await supabase.auth.signOut();
            }
          } else {
            console.log('✅ Sesión obtenida:', session ? 'Usuario autenticado' : 'Sin sesión');
          }
          if (mounted) {
            setUser(session?.user ?? null);
            setLoading(false);
            console.log('✅ AuthContext inicializado');
          }
        } catch (fetchError) {
          // Error de red/conexión
          if (fetchError instanceof Error && 
              (fetchError.message.includes('Failed to fetch') || 
               fetchError.message.includes('ERR_NAME_NOT_RESOLVED'))) {
            console.error('❌ ERROR: No se puede conectar a Supabase');
            console.error('❌ El proyecto de Supabase no existe o está pausado');
            console.error('❌ Ve a https://supabase.com y verifica tu proyecto');
            console.error('❌ O crea un nuevo proyecto y actualiza las credenciales en .env');
            // Limpiar sesión almacenada
            try {
              await supabase.auth.signOut();
            } catch (e) {
              // Ignorar errores al limpiar
            }
          }
          throw fetchError;
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (error instanceof Error) {
          console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack
          });
        }
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔄 Cambio de estado de autenticación:', _event);
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Intentando iniciar sesión con:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('❌ Error al iniciar sesión:', error);
      console.error('❌ Detalles:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
      throw error;
    }
    console.log('✅ Inicio de sesión exitoso', data?.user?.email);
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
