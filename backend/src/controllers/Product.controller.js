const ProductModel = require('../models/Product.model');
const { validateCreate, validateUpdate } = require('../validations/product.schema');
const { record } = require('../services/AuditTrail.service');

exports.list = async (req, res, next) => {
  try {
    const items = await ProductModel.findAll();
    res.json({ success: true, data: items });
  } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
  try {
    const item = await ProductModel.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: item });
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const payload = validateCreate(req.body);
    const created = await ProductModel.create(payload);
    record('CREATE', 'product', null, created);
    res.status(201).json({ success: true, data: created });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await ProductModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });
    const payload = validateUpdate(req.body);
    const updated = await ProductModel.update(req.params.id, payload);
    record('UPDATE', 'product', existing, updated);
    res.json({ success: true, data: updated });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const existing = await ProductModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });
    await ProductModel.remove(req.params.id);
    record('DELETE', 'product', existing, null);
    res.json({ success: true });
  } catch (e) { next(e); }
};
