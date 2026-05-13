import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Learn from './pages/Learn';
import History from './pages/History';
import Courses from './pages/Courses';
import Admin from './pages/Admin';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === 'admin' ? children : <Navigate to="/learn" />;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/learn" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/learn" /> : <Register />} />
      <Route path="/learn" element={<PrivateRoute><Learn /></PrivateRoute>} /> 
      <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} /> 
      <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="*" element={<Navigate to={user ? "/learn" : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <PrimeReactProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}
