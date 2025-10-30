const ElevatorCard = ({ elevator }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'bajo':
        return {
          bg: 'bg-green-500',
          border: 'border-green-500',
          text: 'text-green-600',
          lightBg: 'bg-green-50',
          gradient: 'from-green-500 to-green-600'
        };
      case 'medio':
        return {
          bg: 'bg-yellow-500',
          border: 'border-yellow-500',
          text: 'text-yellow-600',
          lightBg: 'bg-yellow-50',
          gradient: 'from-yellow-500 to-yellow-600'
        };
      case 'alto':
        return {
          bg: 'bg-red-500',
          border: 'border-red-500',
          text: 'text-red-600',
          lightBg: 'bg-red-50',
          gradient: 'from-red-500 to-red-600'
        };
      default:
        return {
          bg: 'bg-gray-500',
          border: 'border-gray-500',
          text: 'text-gray-600',
          lightBg: 'bg-gray-50',
          gradient: 'from-gray-500 to-gray-600'
        };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'bajo':
        return 'Disponible';
      case 'medio':
        return 'Moderado';
      case 'alto':
        return 'Lleno';
      default:
        return 'Desconocido';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'bajo':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'medio':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'alto':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getRecommendation = (status, floor) => {
    switch (status) {
      case 'bajo':
        return `Puede usar el ascensor del piso ${floor}`;
      case 'medio':
        return `Espere un momento en el piso ${floor}`;
      case 'alto':
        return 'Considere usar las escaleras o esperar';
      default:
        return 'Sin recomendaciones';
    }
  };

  const percentage = (elevator.current_people / elevator.capacity) * 100;
  const colors = getStatusColor(elevator.aforo_status);

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${colors.lightBg} ${colors.text}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition">{elevator.name}</h3>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Piso {elevator.floor}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center space-x-1 bg-gradient-to-r ${colors.gradient} shadow-lg`}
        >
          {getStatusIcon(elevator.aforo_status)}
          <span>{getStatusText(elevator.aforo_status)}</span>
        </span>
      </div>

      {/* Occupancy Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-600 font-medium">Ocupación actual</span>
          <span className="font-bold text-gray-900 text-lg">
            {elevator.current_people} <span className="text-gray-400 text-sm">/ {elevator.capacity}</span>
          </span>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className={`h-4 rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-500 ease-out relative overflow-hidden`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1.5 flex items-center justify-between">
          <span>{percentage.toFixed(1)}% de capacidad</span>
          <span className={`font-semibold ${colors.text}`}>
            {elevator.capacity - elevator.current_people} espacios libres
          </span>
        </p>
      </div>

      {/* Recommendation */}
      <div className={`${colors.lightBg} ${colors.border} border-l-4 p-4 rounded-lg`}>
        <div className="flex items-start space-x-2">
          <div className={`${colors.text} mt-0.5`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className={`text-xs font-semibold ${colors.text} uppercase tracking-wide mb-1`}>
              Recomendación
            </p>
            <p className="text-sm text-gray-700 font-medium">
              {getRecommendation(elevator.aforo_status, elevator.floor)}
            </p>
          </div>
        </div>
      </div>

      {/* Device Footer */}
      {elevator.device_id && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-mono">{elevator.device_id}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">En línea</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElevatorCard;
