import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import ElevatorCard from '../components/ElevatorCard';

const UserHome = () => {
  const [elevators, setElevators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchElevators();
    const interval = setInterval(fetchElevators, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchElevators = async () => {
    try {
      const response = await axios.get('/elevators');
      setElevators(response.data.elevators);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar ascensores');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredElevators = () => {
    if (selectedType === 'all') return elevators;
    return elevators.filter((space) => space.space_type === selectedType);
  };

  const getSpacesByType = () => {
    const filtered = getFilteredElevators();
    const grouped = {};
    filtered.forEach((space) => {
      const type = space.space_type || 'otros';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(space);
    });

    // Sort spaces within each category by aforo status
    const statusOrder = { bajo: 0, medio: 1, alto: 2 };
    Object.keys(grouped).forEach((type) => {
      grouped[type].sort((a, b) => statusOrder[a.aforo_status] - statusOrder[b.aforo_status]);
    });

    return grouped;
  };

  const getSpaceTypeIcon = (type) => {
    const icons = {
      salon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      biblioteca: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      cafeteria: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      laboratorio: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      gimnasio: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10h.01M5 3h.01M7 8h10M3 14h18" />
        </svg>
      ),
      ascensor: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
    };
    return icons[type] || icons.ascensor;
  };

  const getSpaceTypeName = (type) => {
    const names = {
      salon: 'Salones',
      biblioteca: 'Bibliotecas',
      cafeteria: 'Cafeterías',
      laboratorio: 'Laboratorios',
      gimnasio: 'Gimnasio',
      ascensor: 'Ascensores',
    };
    return names[type] || 'Otros Espacios';
  };

  const getAllSpaceTypes = () => {
    const types = {};
    elevators.forEach((space) => {
      const type = space.space_type || 'otros';
      if (!types[type]) {
        types[type] = 0;
      }
      types[type]++;
    });
    return types;
  };

  const getGlobalRecommendation = () => {
    const filtered = getFilteredElevators();
    const disponibles = filtered.filter((e) => e.aforo_status === 'bajo');
    const moderados = filtered.filter((e) => e.aforo_status === 'medio');
    const llenos = filtered.filter((e) => e.aforo_status === 'alto');

    const spaceWord = selectedType === 'all' ? 'espacio(s)' : getSpaceTypeName(selectedType).toLowerCase();

    if (disponibles.length > 0) {
      return {
        type: 'success',
        message: `Hay ${disponibles.length} ${spaceWord} disponible(s). Puede usarlos con confianza.`,
      };
    } else if (moderados.length > 0) {
      return {
        type: 'warning',
        message: `Los ${spaceWord} tienen ocupación moderada. Espere un momento antes de ingresar.`,
      };
    } else if (llenos.length > 0) {
      return {
        type: 'danger',
        message: `Los ${spaceWord} están llenos. Considere buscar alternativas o esperar unos minutos.`,
      };
    } else {
      return {
        type: 'info',
        message: `No hay información disponible en este momento.`,
      };
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-gray-600">Cargando información de ascensores...</div>
        </div>
      </>
    );
  }

  const recommendation = getGlobalRecommendation();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Estado de Espacios en Tiempo Real</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Global Recommendation */}
          <div
            className={`mb-8 p-6 rounded-lg ${
              recommendation.type === 'success'
                ? 'bg-green-100 border border-green-400'
                : recommendation.type === 'warning'
                ? 'bg-yellow-100 border border-yellow-400'
                : recommendation.type === 'danger'
                ? 'bg-red-100 border border-red-400'
                : 'bg-blue-100 border border-blue-400'
            }`}
          >
            <div className="flex items-center">
              <svg
                className={`w-6 h-6 mr-3 ${
                  recommendation.type === 'success'
                    ? 'text-green-600'
                    : recommendation.type === 'warning'
                    ? 'text-yellow-600'
                    : recommendation.type === 'danger'
                    ? 'text-red-600'
                    : 'text-blue-600'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p
                className={`font-medium ${
                  recommendation.type === 'success'
                    ? 'text-green-800'
                    : recommendation.type === 'warning'
                    ? 'text-yellow-800'
                    : recommendation.type === 'danger'
                    ? 'text-red-800'
                    : 'text-blue-800'
                }`}
              >
                {recommendation.message}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">Filtrar por tipo de espacio</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  selectedType === 'all'
                    ? 'bg-gradient-to-r from-primary to-green-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Todos</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{elevators.length}</span>
              </button>

              {Object.entries(getAllSpaceTypes()).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-primary to-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className={selectedType === type ? 'text-white' : 'text-primary'}>
                    {getSpaceTypeIcon(type)}
                  </div>
                  <span>{getSpaceTypeName(type)}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Disponibles</p>
                  <p className="text-3xl font-bold text-green-600">
                    {getFilteredElevators().filter((e) => e.aforo_status === 'bajo').length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Ocupación Moderada</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {getFilteredElevators().filter((e) => e.aforo_status === 'medio').length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Llenos</p>
                  <p className="text-3xl font-bold text-red-600">
                    {getFilteredElevators().filter((e) => e.aforo_status === 'alto').length}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Spaces by Category */}
          {Object.entries(getSpacesByType()).map(([type, spaces]) => (
            <div key={type} className="mb-12">
              {/* Category Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-primary to-green-600 p-3 rounded-xl text-white shadow-lg">
                  {getSpaceTypeIcon(type)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{getSpaceTypeName(type)}</h2>
                  <p className="text-sm text-gray-500">{spaces.length} espacio(s) disponible(s)</p>
                </div>
              </div>

              {/* Spaces Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.map((space) => (
                  <ElevatorCard key={space.id} elevator={space} />
                ))}
              </div>
            </div>
          ))}

          {elevators.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No hay espacios registrados en el sistema.
              </p>
            </div>
          )}

          {elevators.length > 0 && getFilteredElevators().length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">
                No hay {getSpaceTypeName(selectedType).toLowerCase()} registrados en el sistema.
              </p>
              <button
                onClick={() => setSelectedType('all')}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition"
              >
                Ver todos los espacios
              </button>
            </div>
          )}

          {/* Auto-refresh indicator */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Actualización automática cada 5 segundos
          </div>
        </div>
      </div>
    </>
  );
};

export default UserHome;
