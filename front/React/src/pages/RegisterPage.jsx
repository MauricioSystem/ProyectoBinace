import React, { useState } from 'react';
import api from '../service/api';

export default function RegisterPage({ onShowLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/register', form);
      setMessage(res.data.message || 'Usuario registrado');
    } catch {
      setMessage('Error en el registro');
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Usuario" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
        <button type="submit">Registrar</button>
      </form>
      <p>{message}</p>
      <button onClick={onShowLogin}>Volver a login</button>
    </div>
  );
}
