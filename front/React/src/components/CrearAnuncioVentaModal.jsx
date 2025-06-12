import React, { useState } from 'react';
import api from '../service/api';

export default function CrearAnuncioVentaModal({ onClose, onAnuncioCreado, monedas }) {
  const [form, setForm] = useState({
    descripcion: '',
    moneda: '',
    cantidadDisponible: '',
    precioUnidad: '',
  });
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImagen(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.moneda) return setMensaje('Selecciona una moneda.');

    const formData = new FormData();
    formData.append('descripcion', form.descripcion);
    formData.append('moneda', form.moneda);
    formData.append('cantidadDisponible', form.cantidadDisponible);
    formData.append('precioUnidad', form.precioUnidad);
    if (imagen) formData.append('imagenMetodoPago', imagen);

    try {
      const token = localStorage.getItem('token');
      const res = await api.post('api/ventas/anuncios', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });
      onAnuncioCreado(res.data);
      onClose();
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al crear anuncio de venta');
    }
  };

  return (
    <div style={{ background: 'black', padding: '1rem', border: '1px solid #ccc' }}>
      <h3>Crear Anuncio de Venta</h3>
      {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <select name="moneda" value={form.moneda} onChange={handleChange} required>
          <option value="">Selecciona una moneda</option>
          {monedas.map((m) => (
            <option key={m.id} value={m.nombre}>
              {m.nombre} ({m.simbolo})
            </option>
          ))}
        </select>
        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          required
        />
        <input
          name="cantidadDisponible"
          placeholder="Cantidad"
          type="number"
          value={form.cantidadDisponible}
          onChange={handleChange}
          required
        />
        <input
          name="precioUnidad"
          placeholder="Precio unitario"
          type="number"
          value={form.precioUnidad}
          onChange={handleChange}
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <div style={{ marginTop: '1rem' }}>
          <button type="submit">Crear</button>
          <button type="button" onClick={onClose} style={{ marginLeft: '1rem' }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
