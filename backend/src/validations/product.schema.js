const Joi = require('joi');

const base = {
  name: Joi.string().min(2).max(128).required(),
  unit: Joi.string().min(1).max(32).required(),
  base_price: Joi.number().precision(2).min(0).required()
};

const createProductSchema = Joi.object(base);
const updateProductSchema = Joi.object({
  name: base.name,
  unit: base.unit,
  base_price: base.base_price
});

function validateCreate(payload) {
  const { error, value } = createProductSchema.validate(payload);
  if (error) throw new Error(error.message);
  return value;
}
function validateUpdate(payload) {
  const { error, value } = updateProductSchema.validate(payload);
  if (error) throw new Error(error.message);
  return value;
}

module.exports = { validateCreate, validateUpdate };
