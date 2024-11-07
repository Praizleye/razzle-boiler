const joi = require("joi");
const mongoose = require("mongoose");
const subscriptionValidation = {
  saveSubscription: {
    body: joi.object().keys({
      subscription: joi
        .object({
          endpoint: joi.string().required(),
          expirationTime: joi.string().allow(null).required(),
          keys: joi
            .object({
              p256dh: joi.string().required(),
              auth: joi.string().required(),
            })
            .required(),
        })
        .required(),
      // userAgent: joi.string().required(),
      // userId: joi
      //   .string()
      //   .required()
      //   .custom((value, helpers) => {
      //     if (!mongoose.Types.ObjectId.isValid(value)) {
      //       return helpers.error("any.invalid");
      //     }
      //     return value;
      //   }),
    }),
  },
};

module.exports = subscriptionValidation;
