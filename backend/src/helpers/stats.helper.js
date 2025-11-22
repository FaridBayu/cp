function basicStats(values = []) {
  if (!values.length) return { count: 0 };
  const sorted = [...values].sort((a,b)=>a-b);
  const sum = values.reduce((a,b)=>a+b,0);
  const avg = sum / values.length;
  const median = values.length % 2 === 1 ? sorted[(values.length-1)/2] : (sorted[values.length/2 -1] + sorted[values.length/2]) / 2;
  return { count: values.length, min: sorted[0], max: sorted[sorted.length-1], avg, median };
}
module.exports = { basicStats };
