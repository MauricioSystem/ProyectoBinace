import express from 'express';
import cors from 'cors';
import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.routes.js';
import billeteraRoutes from './routes/billetera.routes.js';
//import transaccionRoutes from './routes/transaccion.route.js';
import monedaRoutes from './routes/moneda.routes.js';
import ventaRoutes from './routes/venta.routes.js';
import compraRoutes from './routes/compra.routes.js';  
import transferenciaRoutes from './routes/transferencia.routes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

app.use('/', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/billeteras', billeteraRoutes);
//app.use('/api/transacciones', transaccionRoutes);
app.use('/api/monedas', monedaRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/compra', compraRoutes);
app.use('/api/transferencias', transferenciaRoutes);


app.get('/', (req, res) => {
  res.send('API funcionando');
});

async function start() {
  try {
    await sequelize.sync({ force: false });
    console.log('Base de datos sincronizada');

    app.listen(3000, () => {
      console.log('Servidor iniciado en http://localhost:3000');
    });
  } catch (error) {
    console.error('Error sincronizando la base:', error);
  }
}

start();
