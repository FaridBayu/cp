const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/Product.controller');

router.get('/', ProductController.list);
router.get('/:id', ProductController.get);
router.post('/', ProductController.create);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.remove);

module.exports = router;
