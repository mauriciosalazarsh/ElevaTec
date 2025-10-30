import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

const DeviceManager = () => {
  const [devices, setDevices] = useState([]);
  const [elevators, setElevators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({
    device_id: '',
    floor: '',
    ip_address: '',
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [devicesRes, elevatorsRes] = await Promise.all([
        axios.get('/devices'),
        axios.get('/elevators'),
      ]);
      setDevices(devicesRes.data.devices);
      setElevators(elevatorsRes.data.elevators);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar dispositivos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDevice) {
        await axios.put(`/devices/${editingDevice.id}`, formData);
      } else {
        await axios.post('/devices', formData);
      }
      setShowModal(false);
      setEditingDevice(null);
      setFormData({ device_id: '', floor: '', ip_address: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar dispositivo');
    }
  };

  const handleEdit = (device) => {
    setEditingDevice(device);
    setFormData({
      device_id: device.device_id,
      floor: device.floor.toString(),
      ip_address: device.ip_address || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este dispositivo?')) return;

    try {
      await axios.delete(`/devices/${id}`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar dispositivo');
    }
  };

  const handleNew = () => {
    setEditingDevice(null);
    setFormData({ device_id: '', floor: '', ip_address: '' });
    setShowModal(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-gray-600">Cargando dispositivos...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-secondary">Gestión de Dispositivos</h1>
            <button
              onClick={handleNew}
              className="bg-primary hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium transition"
            >
              + Nuevo Dispositivo
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Devices Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Dispositivo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Piso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última vez visto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.map((device) => (
                  <tr key={device.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {device.device_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.floor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.ip_address || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          device.status === 'online'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.last_seen ? new Date(device.last_seen).toLocaleString('es-ES') : 'Nunca'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(device)}
                        className="text-primary hover:text-green-700 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(device.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Elevators Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-secondary mb-4">Ascensores Registrados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {elevators.map((elevator) => (
                <div key={elevator.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">{elevator.name}</h3>
                  <p className="text-sm text-gray-600">Piso: {elevator.floor}</p>
                  <p className="text-sm text-gray-600">Capacidad: {elevator.capacity}</p>
                  <p className="text-sm text-gray-600">
                    Dispositivo: {elevator.device_id || 'No asignado'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              {editingDevice ? 'Editar Dispositivo' : 'Nuevo Dispositivo'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID del Dispositivo</label>
                <input
                  type="text"
                  value={formData.device_id}
                  onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="ESP32CAM-01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Piso</label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección IP (opcional)</label>
                <input
                  type="text"
                  value={formData.ip_address}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="192.168.1.100"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-green-600 text-white py-2 rounded-md transition"
                >
                  {editingDevice ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDevice(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-md transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceManager;
