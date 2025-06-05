import React, { useEffect, useState } from 'react';
import api from '../service/api';

export default function RegistroVentasPage() {
  const [misVentas, setMisVentas] = useState([]);

  useEffect(() => {
    const cargarMisVentas = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('api/ventas/anuncios/mis-ventas', {
          headers: { Authorization: token },
        });
        setMisVentas(res.data);
      } catch (err) {
        console.error('Error al cargar mis ventas:', err);
      }
    };
    cargarMisVentas();
  }, []);

  const handleAceptar = async (anuncioId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(`/api/ventas/anuncios/${anuncioId}/aceptar`, {}, {
        headers: { Authorization: token },
      });
      alert('Venta finalizada y saldo transferido');
      console.log(res.data);
      setMisVentas(misVentas.map(v => v.id === anuncioId ? { ...v, estado: 'finalizado' } : v));
    } catch (err) {
      console.error('Error al aceptar venta:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Error al aceptar venta');
    }
  };

  const handleCancelar = async (anuncioId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(`/api/ventas/anuncios/${anuncioId}/cancelar`, {}, {
        headers: { Authorization: token },
      });
      alert('Venta cancelada correctamente');
      console.log(res.data);
      setMisVentas(misVentas.map(v => v.id === anuncioId ? { ...v, estado: 'cancelado' } : v));
    } catch (err) {
      console.error('Error al cancelar venta:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Error al cancelar venta');
    }
  };

  return (
    <div>
      <h2>Mis Anuncios de Venta</h2>
      {misVentas.length === 0 ? (
        <p>No tienes ventas registradas.</p>
      ) : (
        misVentas.map((v) => (
          <div key={v.id} style={{ border: '1px solid gray', margin: '1rem', padding: '1rem' }}>
            <h4>{v.Moneda?.nombre} - {v.cantidadDisponible}</h4>
            <p>{v.descripcion}</p>
            <p>Estado: {v.estado}</p>

            {/* 🔥 Solo mostrar botones si hay respuesta y está pendiente */}
            {v.RespuestaVenta && v.RespuestaVenta.estado === 'pendiente' && (
              <>
                <p>Respuesta recibida</p>
                <button onClick={() => handleAceptar(v.id)}>Aceptar pago</button>
                <button onClick={() => handleCancelar(v.id)}>Cancelar venta</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
