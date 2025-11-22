const express = require('express');
const router = express.Router();
router.use('/products', require('./Product.routes'));
// Placeholder root
router.get('/', (req, res) => {
  res.json({ message: 'UniCost API root', endpoints: ['/api/health','/api/products'] });
});
module.exports = router;
