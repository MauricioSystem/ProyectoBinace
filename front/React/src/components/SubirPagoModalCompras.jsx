import React, { useState } from 'react';
import api from '../service/api';

export default function SubirPagoModal({ anuncioId, onClose, onPagoRealizado }) {
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (!imagen) {
      setMensaje('Selecciona una imagen de pago');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', imagen);

    try {
      const res = await api.post(`api/compra/anuncios/${anuncioId}/responder`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMensaje('Pago registrado exitosamente');
      onPagoRealizado(res.data);
      onClose();
    } catch (error) {
      console.error('Error al subir pago:', error);
      setMensaje(error.response?.data?.error || 'Error al subir imagen');
    }
  };

  return (
    <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem' }}>
      <h3>Subir comprobante de pago</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} />
        <button type="submit">Enviar pago</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
      {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}
    </div>
  );
}
