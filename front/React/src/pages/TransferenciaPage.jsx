import React, { useEffect, useState } from 'react';
import api from '../service/api';
import ModalTransferencia from '../components/ModalTransferencia';

export default function TransferenciaPage() {
  const [billeteras, setBilleteras] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const cargarBilleteras = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/billeteras', {
        headers: { Authorization: token },
      });
      setBilleteras(res.data);
    } catch (err) {
      console.error('Error al cargar billeteras:', err);
    }
  };

  useEffect(() => {
    cargarBilleteras();
  }, []);

  return (
    <div>
      <h1>Transferencias</h1>
      <button onClick={() => setShowModal(true)}>Realizar Transferencia</button>

      {showModal && (
        <ModalTransferencia
          billeteras={billeteras}
          onClose={() => {
            setShowModal(false);
            cargarBilleteras(); 
          }}
        />
      )}

      <h3>Tus billeteras:</h3>
      <ul>
        {billeteras.map((b) => (
          <li key={b.id}>
            {b.Moneda?.nombre} ({b.Moneda?.simbolo}): {b.saldo}
          </li>
        ))}
      </ul>
    </div>
  );
}
