import React, { useState } from 'react';
import api from '../service/api';

export default function SubirComprobantePagoModalVentas({ anuncioId, onClose }) {
  const [imagen, setImagen] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagen || !cantidad) {
      setMensaje('Debes seleccionar una imagen y una cantidad');
      return;
    }

    const formData = new FormData();
    formData.append('imagenComprobante', imagen);
    formData.append('cantidad', cantidad); // ✅ Enviar cantidad al backend

    try {
      await api.post(`api/ventas/anuncios/${anuncioId}/responder`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token'),
        },
      });
      setMensaje('¡Comprobante subido correctamente!');
      onClose();
    } catch (error) {
      console.error(error);
      setMensaje('Error al subir comprobante.');
    }
  };

  return (
    <div style={{ background: '#eee', padding: '1rem' }}>
      <h3>Subir Comprobante de Pago</h3>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setImagen(e.target.files[0])}
          accept="image/*"
          required
        />
        <div style={{ marginTop: '1rem' }}>
          <button type="submit">Enviar</button>
          <button type="button" onClick={onClose} style={{ marginLeft: '1rem' }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
