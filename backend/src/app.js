const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/ErrorHandler.middleware');
require('dotenv').config();

const app = express();
const startJisdorScheduler = require('./jobs/JisdorScheduler');
const jisdorRoutes = require('./routes/Jisdor.routes');

// Core middleware
app.use(express.json());
app.use(cors({ origin: [process.env.FRONTEND_URL || 'http://localhost:8080', 'http://localhost:5173'], credentials: true }));

// Health route inline (can be moved)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'unicost-backend', timestamp: new Date().toISOString() });
});

// Mount API routes placeholder
app.use('/api', require('./routes'));
startJisdorScheduler();
app.use('/api/kurs-jisdor', jisdorRoutes);


// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
