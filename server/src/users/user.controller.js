const {
  createUserService,
  resendVerificationEmailService,
  confirmEmailService,
  loginUserService,
} = require("./user.service");
function createUserController(req, res, next) {
  return createUserService(req, res, next);
}
function resendVerificationEmailController(req, res, next) {
  return resendVerificationEmailService(req, res, next);
}

function confirmEmailController(req, res, next) {
  return confirmEmailService(req, res, next);
}

function loginUserController(req, res, next) {
  return loginUserService(req, res, next);
}

function getUserSessionController(req, res) {
  return getUsersSessionService(req, res);
}

module.exports = {
  createUserController,
  resendVerificationEmailController,
  confirmEmailController,
  loginUserController,
  getUserSessionController,
};
