import React from 'react';

export default function ListaAnunciosCompra({ anuncios, onResponder }) {
  return (
    <div>
      <h3>Anuncios de compra disponibles</h3>
      {anuncios.length === 0 ? (
        <p>No hay anuncios para mostrar.</p>
      ) : (
        <ul>
          {anuncios.map(a => (
            <li key={a.id} style={{ marginBottom: '1rem' }}>
              <strong>{a.descripcion}</strong> - Cantidad: {a.cantidadDisponible} {a.moneda}
              <br />
              <button onClick={() => onResponder(a.id)}>Vender a este anuncio</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
