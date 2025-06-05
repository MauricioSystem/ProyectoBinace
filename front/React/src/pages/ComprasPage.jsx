import React, { useEffect, useState } from 'react';
import api from '../service/api';
import CrearAnuncioCompraModal from '../components/CrearAnuncioCompraModal';
import SubirPagoModal from '../components/SubirPagoModalCompras';

export default function ComprasPage() {
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
      const res = await api.get(`/api/compra/anuncios?moneda=${monedaSeleccionada}`);
      setAnuncios(res.data);
    } catch (err) {
      console.error('Error al cargar anuncios:', err);
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
      <h1>Compras</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Panel izquierdo: Selección de moneda y listado de anuncios */}
        <div style={{ flex: 1 }}>
          <h3>Selecciona la moneda que quieres comprar:</h3>
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
                {a.descripcion} - {a.cantidad} {a.moneda} a {a.precioUnitario} por unidad
                <button onClick={() => abrirModalPago(a.id)}>Comprar este anuncio</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Panel derecho: Crear anuncio */}
        <div style={{ flex: 1 }}>
          <h3>¿No encontraste un anuncio?</h3>
          <button onClick={() => setShowModalCrear(true)}>Crear Anuncio de Compra</button>
          {showModalCrear && (
            <CrearAnuncioCompraModal
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

      {/* Modal para subir comprobante de pago */}
      {showModalPago && (
        <SubirPagoModal
          anuncioId={anuncioIdPago}
          onClose={() => setShowModalPago(false)}
          onPagoRealizado={() => {
            cargarAnuncios(); // recargar lista de anuncios
          }}
        />
      )}
    </div>
  );
}
