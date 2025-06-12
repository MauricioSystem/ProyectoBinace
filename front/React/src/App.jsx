import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ComprasPage from './pages/ComprasPage';
import VentasPage from './pages/VentasPage';
import RegistroComprasPage from './pages/RegistroComprasPage';
import Navbar from './components/Navbar';
import RegistroVentasPage from './pages/RegistroVentasPage';
import TransferenciaPage from './pages/TransferenciaPage';
import CrudAdminPage from './pages/Admin/CrudAdminPage';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('esAdmin') === 'true';
    if (token) {
      setLoggedIn(true);
      setEsAdmin(admin);
    }
  }, []);

  const AuthWrapper = () => {
    const navigate = useNavigate();

    return (
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage
              onLogin={() => {
                const admin = localStorage.getItem('esAdmin') === 'true';
                setEsAdmin(admin);
                setLoggedIn(true);
              }}
              onShowRegister={() => navigate('/register')}
            />
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  };

  if (!loggedIn) {
    return (
      <Router>
        <AuthWrapper />
      </Router>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Navbar
          username={localStorage.getItem('username')}
          onLogout={() => {
            localStorage.clear();
            setLoggedIn(false);
          }}
        />
        <main style={{ flex: 1, padding: '20px' }}>
          <Routes>
            {esAdmin ? (
              <Route path="/" element={<CrudAdminPage />} />
            ) : (
              <Route path="/" element={<HomePage />} />
            )}
            <Route path="/compras" element={<ComprasPage />} />
            <Route path="/ventas" element={<VentasPage />} />
            <Route path="/registro-compras" element={<RegistroComprasPage />} />
            <Route path="/registro-ventas" element={<RegistroVentasPage />} />
            <Route path="/transferencias" element={<TransferenciaPage />} />
            <Route
              path="/admin"
              element={esAdmin ? <CrudAdminPage /> : <Navigate to="/" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
