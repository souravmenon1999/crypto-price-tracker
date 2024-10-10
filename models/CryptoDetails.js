const mongoose = require('mongoose');

const cryptoDetailsSchema = new mongoose.Schema({
    coin: { type: String, required: true, unique: true },
    latestPrice: { type: Number, required: true },
    marketCap: { type: Number, required: true },
    change24h: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CryptoDetails', cryptoDetailsSchema);
