import React, { useState } from 'react';
import api from '../service/api';

export default function LoginPage({ onLogin, onShowRegister }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('esAdmin', res.data.esAdmin); 

    if (res.data.esAdmin) {
        window.location.href = '/admin'; 
      } else {
        onLogin(); 
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error en el login');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Usuario" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
        <button type="submit">Ingresar</button>
      </form>
      <p>{message}</p>

      {/* Botón para ir a la página de registro */}
      <p>¿No tienes cuenta? <button onClick={onShowRegister}>Regístrate aquí</button></p>
    </div>
  );
}
