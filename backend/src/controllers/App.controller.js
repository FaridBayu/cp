exports.root = (req, res) => {
  res.json({ success: true, message: 'Welcome to UniCost API', endpoints: ['/api/health'] });
};
