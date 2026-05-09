const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const messages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({ error: 'Validation failed', details: messages });
    }

    req.body = value;
    next();
  };
};

// Validation schemas
const schemas = {
  requestOTP: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
    name: Joi.string().min(2).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    role: Joi.string().valid('customer', 'vendor').required()
  }),

  verifyOTP: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    userData: Joi.object({
      name: Joi.string(),
      phone: Joi.string(),
      role: Joi.string(),
      type: Joi.string(),
      companyName: Joi.string()
    }).optional()
  }),

  vendorLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  createBooking: Joi.object({
    serviceType: Joi.string().valid('flight', 'hotel', 'cab').required(),
    serviceId: Joi.string().required(),
    service: Joi.object().required(),
    totalPrice: Joi.number().positive().required(),
    details: Joi.object()
  }),

  updateBookingStatus: Joi.object({
    status: Joi.string().valid('pending', 'accepted', 'delivered', 'cancelled').required()
  }),

  sendMessage: Joi.object({
    text: Joi.string().min(1).max(1000).required()
  })
};

module.exports = { validate, schemas };
