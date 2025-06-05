import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalCrearBilletera from '../components/ModalCrearBilletera';

export default function Home() {
  const [billeteras, setBilleteras] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [monedaSeleccionada, setMonedaSeleccionada] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');

  // Cargar billeteras
  useEffect(() => {
    if (!token) {
      setMensaje('No autorizado. Debes iniciar sesión.');
      return;
    }

    const cargarBilleteras = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/billeteras', {
          headers: { Authorization: token }
        });
        console.log('✅ Billeteras cargadas:', res.data);
        setBilleteras(res.data);
      } catch (err) {
        console.error('❌ Error al cargar billeteras:', err.response?.data || err.message);
        setMensaje('Error al cargar billeteras');
      }
    };

    cargarBilleteras();
  }, [token]);

  // Cargar monedas
  useEffect(() => {
    if (!token) return;

    const cargarMonedas = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/monedas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Monedas cargadas:', res.data);
        setMonedas(res.data);
      } catch (err) {
        console.error('❌ Error al cargar monedas:', err.response?.data || err.message);
        setMensaje('Error al cargar monedas');
      }
    };

    cargarMonedas();
  }, [token]);

  // Crear billetera
  const crearBilletera = async () => {
    if (!monedaSeleccionada) return setMensaje('Selecciona una moneda');

    try {
      const res = await axios.post(
        'http://localhost:3000/api/billeteras',
        { moneda: monedaSeleccionada },
        { headers: { Authorization: token } }
      );
      console.log('✅ Billetera creada:', res.data);
      setBilleteras([...billeteras, res.data]);
      setMensaje('Billetera creada con éxito');
      setMonedaSeleccionada('');
      setShowModal(false);
    } catch (err) {
      console.error('❌ Error al crear billetera:', err.response?.data || err.message);
      setMensaje(err.response?.data?.error || 'Error al crear billetera');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Tus Billeteras</h2>
        <button onClick={() => setShowModal(true)}>+ Crear Billetera</button>
      </div>

      {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}

      {billeteras.length === 0 ? (
        <p>No tienes billeteras aún.</p>
      ) : (
        <ul>
          {billeteras.map(b => (
            <li key={b.id}>
              <strong>ID: {b.id}</strong> - {b.moneda} - Saldo: {b.saldo || 0}
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <ModalCrearBilletera
          monedas={monedas}
          monedaSeleccionada={monedaSeleccionada}
          setMonedaSeleccionada={setMonedaSeleccionada}
          onCrear={crearBilletera}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
