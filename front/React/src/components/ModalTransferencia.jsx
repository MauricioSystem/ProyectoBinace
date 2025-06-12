import React, { useState } from 'react';
import api from '../service/api';

export default function ModalTransferencia({ billeteras, onClose }) {
  const [origenId, setOrigenId] = useState('');
  const [destinoId, setDestinoId] = useState('');
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!origenId || !destinoId || !monto) {
      setMensaje('Completa todos los campos.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await api.post(
        '/api/transferencias',
        {
          billeteraOrigenId: origenId,
          billeteraDestinoId: destinoId,
          monto: parseFloat(monto),
        },
        { headers: { Authorization: token } }
      );

      setMensaje(` ${res.data.mensaje}.\nSaldo origen: ${res.data.saldoOrigen}, saldo destino: ${res.data.saldoDestino}`);
      onClose();
    } catch (err) {
      console.error('Error al transferir:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al transferir');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '1rem', border: '1px solid #ccc' }}>
      <h3>Realizar Transferencia</h3>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <label>Cuenta origen:</label>
        <select value={origenId} onChange={(e) => setOrigenId(e.target.value)}>
          <option value="">Selecciona...</option>
          {billeteras.map((b) => (
            <option key={b.id} value={b.id}>
              {b.Moneda?.nombre} - {b.saldo}
            </option>
          ))}
        </select>

        <label>Cuenta destino (ID billetera):</label>
        <input
          type="number"
          placeholder="ID destino"
          value={destinoId}
          onChange={(e) => setDestinoId(e.target.value)}
        />

        <label>Monto a transferir:</label>
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />

        <div style={{ marginTop: '1rem' }}>
          <button type="submit">Transferir</button>
          <button type="button" onClick={onClose} style={{ marginLeft: '1rem' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
