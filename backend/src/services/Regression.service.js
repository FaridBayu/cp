const regression = require('regression');

function tryPredict(history) {
  // history: [{ timestamp, price }]
  if (!history || history.length < 2) return { available: false, reason: 'insufficient data' };
  const data = history.map((h, idx) => [idx, h.price]);
  const result = regression.linear(data);
  return { available: true, equation: result.equation, r2: result.r2, nextPrediction: result.predict(data.length)[1] };
}

module.exports = { tryPredict };
