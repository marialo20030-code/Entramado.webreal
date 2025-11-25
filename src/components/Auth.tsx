import { useState } from 'react';
import { LogIn, UserPlus, Eye } from 'lucide-react';
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          throw new Error('Por favor ingresa tu nombre');
        }
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) throw signUpError;
        if (data.user) {
          await supabase.from('user_profiles').insert({
            id: data.user.id,
            name: name.trim(),
          });
        }
        await signUp(email, password);
      } else {
        await signIn(email, password);
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
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
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
