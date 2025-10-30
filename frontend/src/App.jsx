import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DeviceManager from './pages/DeviceManager';
import UserHome from './pages/UserHome';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/devices"
            element={
              <PrivateRoute adminOnly>
                <DeviceManager />
              </PrivateRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/home"
            element={
              <PrivateRoute>
                <UserHome />
              </PrivateRoute>
            }
          />

          {/* Default redirect based on auth */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Navigate to="/user/home" replace />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
