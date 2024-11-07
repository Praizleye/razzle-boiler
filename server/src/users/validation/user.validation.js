const joi = require("joi");
const mongoose = require("mongoose");
const userValidation = {
  createUser: {
    body: joi.object().keys({
      firstName: joi.string().required().min(2).max(50),
      lastName: joi.string().required().min(2).max(50),
      email: joi.string().required().email().min(5).max(255),
      password: joi.string().required().min(8).max(1024),
      role: joi.string().valid("user", "admin", "super-admin").required(),
    }),
  },
  loginUser: {
    body: joi.object().keys({
      email: joi.string().required().email().min(5).max(255),
      password: joi.string().required(),
    }),
  },
  resendVerificationEmail: {
    body: joi.object().keys({
      id: joi
        .string()
        .required()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        }),
    }),
  },
  confirmEmail: {
    body: joi.object().keys({
      token: joi.string().required().min(5).max(255),
    }),
  },
};

module.exports = userValidation;
