const express = require('express');
const CryptoDetails = require('../models/CryptoDetails');
const router = express.Router();

// API endpoint to get stats for a given coin
router.get('/', async (req, res) => {
    const coin = req.query.coin.toLowerCase(); // Make it case-insensitive

    try {
        const cryptoData = await CryptoDetails.findOne({ coin });
        if (cryptoData) {
            res.json({
                name: cryptoData.coin,
                price: cryptoData.latestPrice,
                marketCap: cryptoData.marketCap,
                change24h: cryptoData.change24h,
            });
        } else {
            res.status(404).json({ message: 'Coin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
