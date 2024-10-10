const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const connectDB = require('./config/db');
const fetchCryptoData = require('./utils/fetchCryptoData');
const statsRoutes = require('./routes/stats');
const deviationRoutes = require('./routes/deviation');

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/stats', statsRoutes);
app.use('/api/deviation', deviationRoutes);

// Start the background job to fetch data every 2 hours
cron.schedule('0 */2 * * *', fetchCryptoData);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    fetchCryptoData(); // Fetch data immediately when the server starts
});
