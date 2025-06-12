import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

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
        <input
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Registrar</button>
      </form>
      <p>{message}</p>

      <button onClick={() => navigate('/')}>Volver a login</button>
    </div>
  );
}
