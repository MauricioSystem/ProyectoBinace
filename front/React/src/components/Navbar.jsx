import { useNavigate } from 'react-router-dom';

export default function Navbar({ username, onLogout }) {
  const navigate = useNavigate();

  return (
    <aside style={{
      width: '220px',
      backgroundColor: '#282c34',
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <h2>Hola, {username}</h2>
        <button
          style={{ margin: '10px 0', padding: '10px' }}
          onClick={() => navigate('/')}  
        >
          Mis billeteras
        </button>
        <button
          style={{ margin: '10px 0', padding: '10px' }}
          onClick={() => navigate('/compras')}
        >
          Compras
        </button>
        <button
          style={{ margin: '10px 0', padding: '10px' }}
          onClick={() => navigate('/registro-compras')}
        >
          Registro de compras
        </button>
        <button
          style={{ margin: '10px 0', padding: '10px' }}
          onClick={() => navigate('/ventas')}
        >
          Ventas
        </button>
        <button
          style={{ margin: '10px 0', padding: '10px' }}
          onClick={() => navigate('/registro-ventas')}
        >
          Registro de ventas
        </button>
        <button
          style={{ margin: '10px 0', padding: '10px' }}
          onClick={() => navigate('/transferencias')}
        >
          Transferencias
        </button>
      </div>

      <button
        style={{
          marginTop: 'auto',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          padding: '10px',
          cursor: 'pointer'
        }}
        onClick={onLogout}
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
