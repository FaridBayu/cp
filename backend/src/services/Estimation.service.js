const { basicStats } = require('../helpers/stats.helper');
const { tryPredict } = require('./Regression.service');

async function estimateForProduct(productId) {
  // Placeholder history data; replace with DB fetch
  const fakeHistory = [
    { timestamp: Date.now()-86400000*3, price: 100 },
    { timestamp: Date.now()-86400000*2, price: 105 },
    { timestamp: Date.now()-86400000, price: 110 }
  ];
  const prices = fakeHistory.map(h => h.price);
  const stats = basicStats(prices);
  const regression = tryPredict(fakeHistory);
  return { productId, stats, regression, timestamp: new Date().toISOString() };
}

module.exports = { estimateForProduct };
