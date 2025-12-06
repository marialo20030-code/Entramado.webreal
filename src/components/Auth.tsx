import { useState } from 'react';
import { LogIn, UserPlus, Eye, EyeOff, Mail, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onReaderMode: () => void;
}

export function Auth({ onReaderMode }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Validaciones
        if (!name.trim()) {
          throw new Error('Por favor ingresa tu nombre de usuario');
        }
        if (name.trim().length < 2) {
          throw new Error('El nombre de usuario debe tener al menos 2 caracteres');
        }
        if (!email.trim()) {
          throw new Error('Por favor ingresa tu correo electrónico');
        }
        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        // Crear cuenta en Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password
        });

        if (signUpError) throw signUpError;
        
        // Crear perfil de usuario con el nombre y email
        if (data.user) {
          const { error: profileError } = await supabase.from('user_profiles').insert({
            id: data.user.id,
            name: name.trim(),
            email: email.trim(), // Almacenar el email también para poder iniciar sesión con nombre de usuario
          });
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
            // No lanzamos error aquí porque la cuenta ya se creó
            // El perfil se puede crear después
          }
        }
        
        // Llamar a signUp del contexto (aunque ya se hizo arriba, mantener para consistencia)
        await signUp(email.trim(), password);
      } else {
        // Iniciar sesión
        const loginInput = email.trim();
        if (!loginInput) {
          throw new Error('Por favor ingresa tu nombre de usuario o correo electrónico');
        }
        if (!password) {
          throw new Error('Por favor ingresa tu contraseña');
        }

        // Determinar si es un email o un nombre de usuario
        const isEmail = loginInput.includes('@');
        let userEmail = loginInput;

        if (!isEmail) {
          // Es un nombre de usuario, buscar el email asociado en user_profiles
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('email, id')
            .eq('name', loginInput)
            .single();

          if (profileError || !profile) {
            throw new Error('Nombre de usuario no encontrado');
          }

          // Si el perfil tiene email almacenado, usarlo
          if (profile.email) {
            userEmail = profile.email;
          } else {
            // Si no tiene email almacenado, intentar obtenerlo desde auth.users
            // Como no tenemos acceso directo, intentamos iniciar sesión con el ID
            // Pero Supabase requiere email, así que necesitamos otra solución
            
            // Por ahora, si no hay email en el perfil, pedir que use el email
            throw new Error('No se encontró el correo asociado. Por favor usa tu correo electrónico para iniciar sesión.');
          }
        }

        // Iniciar sesión con el email
        await signIn(userEmail, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-800 mb-2">
            {isSignUp ? 'Crear cuenta' : 'Bienvenido'}
          </h1>
          <p className="text-gray-500 text-sm">
            Comparte ideas e inspiración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre de usuario
              </label>
              <input
                type="text"
                placeholder="Ingresa tu nombre de usuario"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
            </div>
          )}

          {isSignUp ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre de usuario o correo
              </label>
              <input
                type="text"
                placeholder="Nombre de usuario o correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {!isSignUp && (
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-600 hover:text-blue-700 text-right w-full"
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}

          {showForgotPassword && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-blue-900">Recuperar contraseña</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setResetSent(false);
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <X size={16} />
                </button>
              </div>
              {!resetSent ? (
                <>
                  <p className="text-xs text-blue-800">
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="tu@correo.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (!resetEmail.trim()) {
                          setError('Por favor ingresa tu correo electrónico');
                          return;
                        }
                        try {
                          const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
                            redirectTo: `${window.location.origin}/reset-password`,
                          });
                          if (error) throw error;
                          setResetSent(true);
                          setError('');
                        } catch (err) {
                          setError(err instanceof Error ? err.message : 'Error al enviar el correo');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
                    >
                      <Mail size={16} />
                      Enviar
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">✓ Correo enviado</p>
                  <p className="text-xs">
                    Revisa tu bandeja de entrada. Si no lo encuentras, revisa la carpeta de spam.
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-300 to-violet-300 text-white py-3 rounded-2xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              'Cargando...'
            ) : (
              <>
                {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                {isSignUp ? 'Registrarse' : 'Entrar'}
              </>
            )}
          </button>
        </form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
          }}
          className="w-full mt-4 text-gray-600 text-sm hover:text-gray-800 transition-colors"
        >
          {isSignUp ? '¿Ya tienes cuenta? Entra' : '¿No tienes cuenta? Regístrate'}
        </button>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onReaderMode}
            className="w-full flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-100 py-3 rounded-2xl transition-all"
          >
            <Eye size={20} />
            Explorar como lector
          </button>
        </div>
      </div>
    </div>
  );
}
