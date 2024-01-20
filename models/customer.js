const Joi = require("joi");
const mongoose = require("mongoose");

const customersSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 255 },
  isGold: { type: Boolean, default: false },
  phone: { type: String, required: true, minlength: 5, maxlength: 10 },
});

const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    isGold: Joi.bool().required(),
    phone: Joi.string().min(5).max(10).required(),
  });

  return schema.validate(customer);
};

const Customer = mongoose.model("Customer", customersSchema);

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
