const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/ErrorHandler.middleware');
require('dotenv').config();
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Core middleware
app.use(express.json());
app.use(cors({ 
    origin: [
        'http://localhost:8080', 
        'http://localhost:5173', // Default Vite
        process.env.FRONTEND_URL // Tambahan jika ada di .env
    ], 
    credentials: true 
}));

// Health route inline (can be moved)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'unicost-backend', timestamp: new Date().toISOString() });
});

// Mount API routes placeholder
app.use('/api', require('./routes'));

app.use('/api/riwayat', transactionRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
