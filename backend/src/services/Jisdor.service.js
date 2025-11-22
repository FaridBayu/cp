const fetch = require('node-fetch');

async function fetchRate() {
  const url = process.env.JISDOR_API_URL;
  if (!url) return { success: false, message: 'JISDOR_API_URL not set' };
  try {
    const res = await fetch(url);
    if (!res.ok) return { success: false, message: 'Failed to fetch JISDOR' };
    const data = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, message: e.message };
  }
}
module.exports = { fetchRate };
