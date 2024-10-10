const express = require('express');
const HistoricalPrice = require('../models/HistoricalPrice');
const router = express.Router();

// Function to calculate standard deviation
function calculateStandardDeviation(prices) {
    const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
    const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
    return Math.sqrt(variance);
}

// API endpoint to get standard deviation for a given coin
router.get('/', async (req, res) => {
    const coin = req.query.coin.toLowerCase(); // Make it case-insensitive

    try {
        const historicalData = await HistoricalPrice.find({ coin }).sort({ timestamp: -1 }).limit(100);
        const prices = historicalData.map(record => record.price);

        if (prices.length > 0) {
            const deviation = calculateStandardDeviation(prices);
            res.json({ deviation });
        } else {
            res.status(404).json({ message: 'No historical data found for this coin' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
