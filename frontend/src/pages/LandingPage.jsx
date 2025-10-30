import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-primary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-green-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="bg-primary p-3 rounded-xl shadow-lg shadow-primary/50">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
            ElevaTec
          </h1>
        </div>

        <Link
          to="/login"
          className="px-6 py-3 bg-primary hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          <span>Iniciar Sesión</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                Monitoreo Inteligente de
                <span className="block bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
                  Espacios en Tiempo Real
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Sistema avanzado de control de aforo utilizando Computer Vision e IoT para optimizar el uso de espacios compartidos en tu institución.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                className="px-8 py-4 bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary text-white font-bold rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center space-x-2"
              >
                <span>Comenzar Ahora</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <a
                href="#features"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg transition-all duration-300 border-2 border-white/20 hover:border-white/40"
              >
                Conoce Más
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">24/7</div>
                <div className="text-sm text-gray-400 mt-1">Monitoreo Continuo</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400">Real-Time</div>
                <div className="text-sm text-gray-400 mt-1">Datos en Vivo</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">IoT</div>
                <div className="text-sm text-gray-400 mt-1">Tecnología ESP32</div>
              </div>
            </div>
          </div>

          {/* Right Image/Visual */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-primary/20 to-green-600/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* Simulated Dashboard Preview */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/30 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="text-white">
                      <div className="font-semibold">Panel de Control</div>
                      <div className="text-xs text-gray-400">Vista en tiempo real</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-300">En línea</span>
                  </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
                    <div className="text-green-400 text-sm mb-2">Disponibles</div>
                    <div className="text-3xl font-bold text-white">8</div>
                  </div>
                  <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
                    <div className="text-yellow-400 text-sm mb-2">Moderados</div>
                    <div className="text-3xl font-bold text-white">3</div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3 pt-2">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">Biblioteca Central</span>
                      <span className="text-green-400 text-xs font-semibold">25%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">Cafetería Principal</span>
                      <span className="text-yellow-400 text-xs font-semibold">65%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">Gimnasio UTEC</span>
                      <span className="text-red-400 text-xs font-semibold">92%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-400/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-4">Características Principales</h3>
          <p className="text-xl text-gray-400">Tecnología de punta para gestionar tus espacios</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-primary/50 transition-all duration-300 hover:scale-105">
            <div className="bg-primary/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Computer Vision</h4>
            <p className="text-gray-400">Detección automática de personas usando algoritmos YOLO y procesamiento de imágenes en tiempo real.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
            <div className="bg-green-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Dispositivos IoT</h4>
            <p className="text-gray-400">Red de cámaras ESP32-CAM distribuidas en puntos estratégicos para monitoreo continuo.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
            <div className="bg-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Dashboard Interactivo</h4>
            <p className="text-gray-400">Panel de control completo con métricas, gráficos y análisis de datos históricos.</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
            <div className="bg-yellow-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Tiempo Real</h4>
            <p className="text-gray-400">Actualización automática cada 5 segundos con información precisa del estado de ocupación.</p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <div className="bg-purple-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Multi-Usuario</h4>
            <p className="text-gray-400">Sistema de roles para administradores y usuarios con permisos diferenciados.</p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-red-500/50 transition-all duration-300 hover:scale-105">
            <div className="bg-red-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Seguro y Confiable</h4>
            <p className="text-gray-400">Autenticación JWT, encriptación de datos y arquitectura robusta con Docker.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-primary p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-gray-400">© 2025 ElevaTec. Sistema de monitoreo inteligente.</span>
            </div>
            <div className="text-gray-500 text-sm">
              Desarrollado con tecnología de Computer Vision e IoT
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
