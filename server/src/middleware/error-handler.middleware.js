// Error handler function
const errorHandler = (err, req, res, next) => {
  console.log("🚀 ~ errorHandler ~ err:", err);
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

const customErrorHandler = (statusCode, message, next) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return next(error);
};

const successHandler = (res, message, statusCode = 200) => {
  let copyMessage;

  if (typeof message === "object" && message !== null) {
    copyMessage = JSON.parse(JSON.stringify(message));

    if (copyMessage.value && typeof copyMessage.value === "object") {
      delete copyMessage.value.password;
      delete copyMessage.value.refreshToken;
      delete copyMessage.value.subscription;
    } else if (copyMessage.password || copyMessage.refreshToken) {
      delete copyMessage.password;
      delete copyMessage.refreshToken;
    }
  } else {
    copyMessage = message;
  }

  return res.status(statusCode).json({
    success: true,
    message: copyMessage,
  });
};
module.exports = { errorHandler, customErrorHandler, successHandler };
