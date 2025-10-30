import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DeviceManager from './pages/DeviceManager';
import UserHome from './pages/UserHome';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
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

          {/* Redirect unknown routes to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
