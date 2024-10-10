const axios = require('axios');
const HistoricalPrice = require('../models/HistoricalPrice');
const CryptoDetails = require('../models/CryptoDetails');

// Function to fetch cryptocurrency data from CoinGecko
async function fetchCryptoData() {
    const coins = process.env.CRYPTO_COINS.split(','); // Get coins from environment variable

    try {
        const responses = await Promise.all(coins.map(coin => {
            return axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`);
        }));

        responses.forEach((response, index) => {
            console.log(`Response for ${coins[index]}:`, response.data);
        });

        for (let i = 0; i < coins.length; i++) {
            const coin = coins[i];
            const data = responses[i].data[coin];

            if (data) {
                // Save historical price
                const historicalRecord = new HistoricalPrice({
                    coin,
                    price: data.usd,
                });
                await historicalRecord.save();

                // Update crypto details with the latest price
                await CryptoDetails.findOneAndUpdate(
                    { coin },
                    {
                        latestPrice: data.usd,
                        marketCap: data.usd_market_cap,
                        change24h: data.usd_24h_change,
                        lastUpdated: new Date(),
                    },
                    { upsert: true }
                );

                console.log(`Updated data for ${coin}:`, historicalRecord);
            } else {
                console.error(`No data found for coin: ${coin}`);
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

module.exports = fetchCryptoData;
