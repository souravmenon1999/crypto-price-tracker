const express = require('express');
const axios = require('axios');
const HistoricalPrice = require('../models/HistoricalPrice');
const CryptoDetails = require('../models/CryptoDetails');
const router = express.Router();

// Valid coin IDs
const validCoins = ['bitcoin', 'matic-network', 'ethereum'];

// API endpoint to get stats for a given coin
router.get('/', async (req, res) => {
    const coin = req.query.coin.toLowerCase(); // Make it case-insensitive

    // Validate coin name
    if (!validCoins.includes(coin)) {
        return res.status(400).json({ message: 'Invalid coin name. Please use one of the following: bitcoin, matic-network, ethereum.' });
    }

    try {
        // Fetch data from CoinGecko for the specific coin
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`);
        const data = response.data[coin];
        console.log("Full API Response:", response.data); // Log the full response for debugging

        if (data) {
            // Update crypto details with the latest price
            await CryptoDetails.findOneAndUpdate(
                { coin },
                {
                    latestPrice: data.usd,
                    marketCap: data.usd_market_cap,
                    change24h: data.usd_24h_change,
                    lastUpdated: new Date(),
                },
                { upsert: true } // Create new document if not found
            );

            // Save historical price
            const historicalRecord = new HistoricalPrice({
                coin,
                price: data.usd,
            });
            await historicalRecord.save();

            res.json({
                price: data.usd,
                marketCap: data.usd_market_cap,
                change24h: data.usd_24h_change,
            });
        } else {
            res.status(404).json({ message: 'Coin not found in the API response.' });
        }
    } catch (error) {
        console.error('Error fetching data from CoinGecko:', error.message); // Log the error message
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
