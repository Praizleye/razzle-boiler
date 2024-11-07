const { customErrorHandler } = require("./error-handler.middleware");

const validate = (payload) => {
  const { req, res, next, schema } = payload;
  const { error, value } = schema;
  console.log("🚀 ~ validate ~ schema:", schema);
  console.log("🚀 ~ validate ~ req:", req.body);
  if (error) {
    customErrorHandler(400, error.message, next);
  }
  next();
};

module.exports = validate;
