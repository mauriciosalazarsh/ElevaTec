import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { AforoDistributionChart, PeakHoursChart, DailyTrendChart } from '../components/DashboardChart';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [metricsRes, spacesRes] = await Promise.all([
        axios.get('/metrics'),
        axios.get('/elevators'),
      ]);

      setMetrics(metricsRes.data);
      setSpaces(spacesRes.data.elevators);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const getSpacesByType = () => {
    const grouped = {};
    spaces.forEach((space) => {
      const type = space.space_type || 'otros';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(space);
    });
    return grouped;
  };

  const getFilteredSpaces = () => {
    if (selectedType === 'all') return spaces;
    return spaces.filter((space) => space.space_type === selectedType);
  };

  const getFilteredMetrics = () => {
    const filtered = getFilteredSpaces();

    if (filtered.length === 0) {
      return {
        total_elevators: 0,
        avg_aforo_percentage: 0,
        available: 0,
        moderate: 0,
        full: 0,
      };
    }

    const total = filtered.length;
    const available = filtered.filter((s) => s.aforo_status === 'bajo').length;
    const moderate = filtered.filter((s) => s.aforo_status === 'medio').length;
    const full = filtered.filter((s) => s.aforo_status === 'alto').length;

    const totalOccupancy = filtered.reduce((sum, space) => {
      const percentage = space.capacity > 0 ? (space.current_people / space.capacity) * 100 : 0;
      return sum + percentage;
    }, 0);
    const avgOccupancy = total > 0 ? totalOccupancy / total : 0;

    return {
      total_elevators: total,
      avg_aforo_percentage: avgOccupancy,
      available,
      moderate,
      full,
    };
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
    };
    return icons[type] || (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    );
  };

  const getSpaceTypeName = (type) => {
    const names = {
      salon: 'Salones',
      biblioteca: 'Bibliotecas',
      cafeteria: 'Cafeterías',
      laboratorio: 'Laboratorios',
      gimnasio: 'Gimnasio',
    };
    return names[type] || 'Espacios';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-gray-600">Cargando dashboard...</div>
        </div>
      </>
    );
  }

  const spacesByType = getSpacesByType();
  const filteredSpaces = getFilteredSpaces();
  const filteredMetrics = getFilteredMetrics();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-secondary">Panel de Administración</h1>
            {selectedType !== 'all' && (
              <button
                onClick={() => setSelectedType('all')}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Limpiar filtro</span>
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Filter indicator */}
          {selectedType !== 'all' && (
            <div className="mb-6 bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="font-medium">Filtrando por: {getSpaceTypeName(selectedType)}</span>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    {selectedType === 'all' ? 'Total Espacios' : `${getSpaceTypeName(selectedType)}`}
                  </p>
                  <p className="text-4xl font-bold mt-2">{filteredMetrics.total_elevators}</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Disponibles</p>
                  <p className="text-4xl font-bold mt-2">{filteredMetrics.available}</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Ocupación Promedio</p>
                  <p className="text-4xl font-bold mt-2">
                    {filteredMetrics.avg_aforo_percentage.toFixed(1)}<span className="text-2xl">%</span>
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Llenos</p>
                  <p className="text-4xl font-bold mt-2">{filteredMetrics.full}</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Spaces by Type Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Espacios por Categoría</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(spacesByType).map(([type, typeSpaces]) => (
                <div
                  key={type}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-gray-200 hover:border-primary transition-all cursor-pointer"
                  onClick={() => setSelectedType(type)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-primary">
                      {getSpaceTypeIcon(type)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{typeSpaces.length}</div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{getSpaceTypeName(type)}</p>
                  <div className="mt-2 flex items-center space-x-2 text-xs">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      {typeSpaces.filter(s => s.aforo_status === 'bajo').length} libre
                    </span>
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">
                      {typeSpaces.filter(s => s.aforo_status === 'alto').length} lleno
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribución de Aforo</h2>
              {metrics?.aforo_distribution && (
                <AforoDistributionChart data={metrics.aforo_distribution} />
              )}
            </div>

            {metrics?.peak_hours && metrics.peak_hours.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Horas Pico (7 días)</h2>
                <PeakHoursChart data={metrics.peak_hours} />
              </div>
            )}
          </div>

          {metrics?.daily_trend && metrics.daily_trend.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tendencia Diaria (7 días)</h2>
              <DailyTrendChart data={metrics.daily_trend} />
            </div>
          )}

          {/* Spaces Table */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Estado de Espacios en Tiempo Real</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedType === 'all'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos ({spaces.length})
                </button>
                {Object.entries(spacesByType).map(([type, typeSpaces]) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedType === type
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getSpaceTypeName(type)} ({typeSpaces.length})
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espacio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piso</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ocupación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispositivo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSpaces.map((space) => (
                    <tr key={space.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-primary">
                            {getSpaceTypeIcon(space.space_type)}
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">{space.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{getSpaceTypeName(space.space_type)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {space.floor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 max-w-xs">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="font-medium text-gray-900">{space.current_people} / {space.capacity}</span>
                              <span className="text-gray-500">{((space.current_people / space.capacity) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  space.aforo_status === 'bajo'
                                    ? 'bg-green-500'
                                    : space.aforo_status === 'medio'
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min((space.current_people / space.capacity) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            space.aforo_status === 'bajo'
                              ? 'bg-green-100 text-green-800'
                              : space.aforo_status === 'medio'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {space.aforo_status === 'bajo' ? 'Disponible' : space.aforo_status === 'medio' ? 'Moderado' : 'Lleno'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-500 font-mono">{space.device_id || 'N/A'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Auto-refresh indicator */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Actualización automática cada 10 segundos</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
