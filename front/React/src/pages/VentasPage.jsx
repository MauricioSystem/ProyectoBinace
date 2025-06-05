import React, { useEffect, useState } from 'react';
import api from '../service/api';
import CrearAnuncioVentaModal from '../components/CrearAnuncioVentaModal';
import SubirComprobantePagoModalVentas from '../components/SubirComprobantePagoModalVentas';

export default function VentasPage() {
  const [monedas, setMonedas] = useState([]);
  const [monedaSeleccionada, setMonedaSeleccionada] = useState('');
  const [anuncios, setAnuncios] = useState([]);
  const [showModalCrear, setShowModalCrear] = useState(false);
  const [showModalPago, setShowModalPago] = useState(false);
  const [anuncioIdPago, setAnuncioIdPago] = useState(null);

  useEffect(() => {
    const cargarMonedas = async () => {
      try {
        const res = await api.get('/api/monedas');
        setMonedas(res.data);
      } catch (err) {
        console.error('Error al cargar monedas:', err);
      }
    };
    cargarMonedas();
  }, []);

  const cargarAnuncios = async () => {
    if (!monedaSeleccionada) return;
    try {
      const res = await api.get(`/api/ventas/anuncios?moneda=${monedaSeleccionada}`);
      setAnuncios(res.data);
    } catch (err) {
      console.error('Error al cargar anuncios de venta:', err);
    }
  };

  useEffect(() => {
    cargarAnuncios();
  }, [monedaSeleccionada]);

  const abrirModalPago = (anuncioId) => {
    setAnuncioIdPago(anuncioId);
    setShowModalPago(true);
  };

  return (
    <div>
      <h1>Ventas</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Panel izquierdo: Selección de moneda y listado de anuncios */}
        <div style={{ flex: 1 }}>
          <h3>Selecciona la moneda que quieres vender:</h3>
          <select
            value={monedaSeleccionada}
            onChange={(e) => setMonedaSeleccionada(e.target.value)}
          >
            <option value="">Selecciona...</option>
            {monedas.map((m) => (
              <option key={m.id} value={m.nombre}>{m.nombre}</option>
            ))}
          </select>
          <ul>
            {anuncios.map((a) => (
              <li key={a.id}>
                {a.descripcion} - {a.cantidadDisponible} {a.moneda} a {a.precioUnidad} por unidad
                <button onClick={() => abrirModalPago(a.id)}>Subir comprobante de pago</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Panel derecho: Crear anuncio */}
        <div style={{ flex: 1 }}>
          <h3>¿No encontraste un comprador?</h3>
          <button onClick={() => setShowModalCrear(true)}>Crear Anuncio de Venta</button>
          {showModalCrear && (
            <CrearAnuncioVentaModal
              onClose={() => setShowModalCrear(false)}
              onAnuncioCreado={(nuevo) => {
                if (nuevo.moneda === monedaSeleccionada) {
                  setAnuncios([...anuncios, nuevo]);
                }
              }}
              monedas={monedas}
            />
          )}
        </div>
      </div>

      {}
      {showModalPago && (
        <SubirComprobantePagoModalVentas
          anuncioId={anuncioIdPago}
          onClose={() => setShowModalPago(false)}
        />
      )}
    </div>
  );
}
