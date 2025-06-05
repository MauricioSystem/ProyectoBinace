import React, { useEffect, useState } from 'react';
import api from '../service/api';

export default function RegistroComprasPage() {
  const [misAnuncios, setMisAnuncios] = useState([]);

  useEffect(() => {
    const fetchMisAnuncios = async () => {
      try {
        const res = await api.get('/api/compra/anuncios/mis-anuncios');
        setMisAnuncios(res.data);
      } catch (err) {
        console.error('Error al obtener mis anuncios:', err.response?.data || err.message);
      }
    };
    fetchMisAnuncios();
  }, []);

  const handleAceptar = async (anuncioId) => {
    try {
      const res = await api.post(`/api/compra/anuncios/${anuncioId}/aceptar`);
      alert('Compra finalizada y saldo transferido');
      console.log(res.data);
      // Actualiza la lista:
      setMisAnuncios(misAnuncios.map(a => a.id === anuncioId ? { ...a, estado: 'finalizado' } : a));
    } catch (err) {
      console.error('Error al aceptar:', err.response?.data || err.message);
    }
  };

  const handleCancelar = async (anuncioId) => {
    try {
      const res = await api.post(`/api/compra/anuncios/${anuncioId}/cancelar`);
      alert('Compra cancelada');
      console.log(res.data);
      setMisAnuncios(misAnuncios.map(a => a.id === anuncioId ? { ...a, estado: 'cancelado' } : a));
    } catch (err) {
      console.error('Error al cancelar:', err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>Mis Anuncios de Compra</h2>
      {misAnuncios.length === 0 ? (
        <p>No tienes anuncios todavía.</p>
      ) : (
        misAnuncios.map(a => (
          <div key={a.id} style={{ border: '1px solid gray', margin: '1rem', padding: '1rem' }}>
            <h4>{a.moneda} - {a.cantidad}</h4>
            <p>{a.descripcion}</p>
            <p>Estado: {a.estado}</p>
            {a.RespuestaCompra && a.estado === 'esperando_respuesta' && (
              <>
                <p>Respuesta recibida</p>
                <button onClick={() => handleAceptar(a.id)}>Aceptar pago</button>
                <button onClick={() => handleCancelar(a.id)}>Cancelar compra</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
