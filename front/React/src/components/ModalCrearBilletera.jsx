import React from 'react';

export default function ModalCrearBilletera({
  monedas,
  monedaSeleccionada,
  setMonedaSeleccionada,
  onCrear,
  onClose
}) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: 'rgba(81, 81, 81, 1)',
        padding: '2rem',
        borderRadius: '8px',
        width: '300px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Crear Billetera</h3>

        <select
          value={monedaSeleccionada}
          onChange={e => setMonedaSeleccionada(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem'
          }}
        >
          <option value="">Selecciona una moneda</option>
          {monedas.map(m => (
            <option key={m.id} value={m.id}>
              {m.nombre} ({m.simbolo})
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={onCrear}
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Crear
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#f436',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
