import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isRegister) {
      // Register new user
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
          setIsRegister(false);
          setName('');
          setPassword('');
          setConfirmPassword('');
        } else {
          setError(data.error || 'Error al crear cuenta');
        }
      } catch (err) {
        setError('Error de conexión. Intenta nuevamente.');
      }
    } else {
      // Login existing user
      const result = await login(email, password);

      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/home');
        }
      } else {
        setError(result.error);
      }
    }

    setLoading(false);
  };

  const fillDemoCredentials = () => {
    setEmail('admin@elevatec.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-primary flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-green-400 opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="bg-primary p-3 rounded-xl shadow-lg shadow-primary/50">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
              ElevaTec
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Sistema de Monitoreo Inteligente</p>
          <p className="text-gray-500 text-sm mt-2">Control de aforo en tiempo real</p>
        </div>

        {/* Login card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center space-x-2 animate-shake">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition"
                    placeholder="Tu nombre completo"
                    required={isRegister}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition"
                  placeholder="usuario@elevatec.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition"
                    placeholder="••••••••"
                    required={isRegister}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{isRegister ? 'Creando cuenta...' : 'Iniciando sesión...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isRegister ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    )}
                  </svg>
                  <span>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle between login and register */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setSuccess('');
              }}
              className="text-gray-300 hover:text-primary transition text-sm"
            >
              {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>

          {/* Demo credentials - only show on login */}
          {!isRegister && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">Credenciales de prueba:</p>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-primary hover:text-green-400 text-sm font-medium transition flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Usar demo</span>
                </button>
              </div>
              <div className="mt-2 bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="font-mono text-xs text-gray-300">admin@elevatec.com</p>
                <p className="font-mono text-xs text-gray-300">admin123</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 ElevaTec. Sistema de monitoreo inteligente.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
