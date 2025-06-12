import React, { useEffect, useState } from 'react';
import api from '../../service/api';

export default function CrudAdminPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [nuevaMoneda, setNuevaMoneda] = useState({ nombre: '', simbolo: '', tipoCambioUSD: '' });
  const [monedaEditando, setMonedaEditando] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    cargarUsuarios();
    cargarMonedas();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await api.get('/api/auth', { headers: { Authorization: token } });
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const cargarMonedas = async () => {
    try {
      const res = await api.get('/api/monedas', { headers: { Authorization: token } });
      setMonedas(res.data);
    } catch (err) {
      console.error('Error al cargar monedas:', err);
    }
  };

  const cambiarRol = async (id, esAdmin) => {
    try {
      await api.put(`/api/auth/${id}/rol`, { esAdmin: !esAdmin }, {
        headers: { Authorization: token },
      });
      cargarUsuarios();
    } catch (err) {
      console.error('Error al cambiar rol:', err.response?.data || err.message);
    }
  };

  const crearMoneda = async (e) => {
    e.preventDefault();
    if (!nuevaMoneda.nombre || !nuevaMoneda.simbolo || !nuevaMoneda.tipoCambioUSD) {
      alert('Completa todos los campos');
      return;
    }
    try {
      await api.post('/api/monedas', nuevaMoneda, {
        headers: { Authorization: token },
      });
      setNuevaMoneda({ nombre: '', simbolo: '', tipoCambioUSD: '' });
      cargarMonedas();
    } catch (err) {
      console.error('Error al crear moneda:', err.response?.data || err.message);
    }
  };

  const eliminarMoneda = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta moneda?')) return;
    try {
      await api.delete(`/api/monedas/${id}`, { headers: { Authorization: token } });
      cargarMonedas();
    } catch (err) {
      console.error('Error al eliminar moneda:', err.response?.data || err.message);
    }
  };

  const iniciarEdicion = (moneda) => {
    setMonedaEditando({ ...moneda });
  };

  const guardarEdicion = async () => {
    if (!monedaEditando.nombre || !monedaEditando.simbolo || !monedaEditando.tipoCambioUSD) {
      alert('Completa todos los campos');
      return;
    }
    try {
      await api.put(`/api/monedas/${monedaEditando.id}`, monedaEditando, {
        headers: { Authorization: token },
      });
      setMonedaEditando(null);
      cargarMonedas();
    } catch (err) {
      console.error('Error al actualizar moneda:', err.response?.data || err.message);
    }
  };

  const handleInputChange = (e) => {
    setNuevaMoneda({ ...nuevaMoneda, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setMonedaEditando({ ...monedaEditando, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Panel de Administración</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Usuarios</h2>
        <ul>
          {usuarios.map(u => (
            <li key={u.id}>
              {u.username} - Rol: {u.esAdmin ? 'Admin' : 'Usuario'}
              <button onClick={() => cambiarRol(u.id, u.esAdmin)} style={{ marginLeft: '1rem' }}>
                Cambiar a {u.esAdmin ? 'Usuario' : 'Admin'}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Monedas</h2>
        <form onSubmit={crearMoneda} style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={nuevaMoneda.nombre}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="simbolo"
            placeholder="Símbolo"
            value={nuevaMoneda.simbolo}
            onChange={handleInputChange}
          />
          <input
            type="number"
            step="0.01"
            name="tipoCambioUSD"
            placeholder="Tipo de cambio en USD"
            value={nuevaMoneda.tipoCambioUSD}
            onChange={handleInputChange}
          />
          <button type="submit">Crear Moneda</button>
        </form>

        <ul>
          {monedas.map(m => (
            <li key={m.id}>
              {m.nombre} ({m.simbolo}) - Tipo cambio USD: {m.tipoCambioUSD}
              <button onClick={() => eliminarMoneda(m.id)} style={{ marginLeft: '1rem' }}>Eliminar</button>
              <button onClick={() => iniciarEdicion(m)} style={{ marginLeft: '0.5rem' }}>Editar</button>
            </li>
          ))}
        </ul>

        {monedaEditando && (
          <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
            <h4>Editando Moneda</h4>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={monedaEditando.nombre}
              onChange={handleEditInputChange}
            />
            <input
              type="text"
              name="simbolo"
              placeholder="Símbolo"
              value={monedaEditando.simbolo}
              onChange={handleEditInputChange}
            />
            <input
              type="number"
              step="0.01"
              name="tipoCambioUSD"
              placeholder="Tipo de cambio en USD"
              value={monedaEditando.tipoCambioUSD}
              onChange={handleEditInputChange}
            />
            <button onClick={guardarEdicion}>Guardar</button>
            <button onClick={() => setMonedaEditando(null)} style={{ marginLeft: '0.5rem' }}>Cancelar</button>
          </div>
        )}
      </section>
    </div>
  );
}
