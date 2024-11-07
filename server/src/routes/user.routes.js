const router = require("express").Router();
const userController = require("../users/user.controller");
const userValidation = require("../users/validation/user.validation");
const validate = require("../middleware/custom-validation.middleware");
const protectRoutes = require("../middleware/protect-routes.middleware");

router.post(
  "/users",
  (req, res, next) =>
    validate({
      req,
      res,
      next,
      schema: userValidation.createUser.body.validate(req.body),
    }),
  (req, res, next) => userController.createUserController(req, res, next)
);

router.post(
  "/users/resend-verification-email",
  (req, res, next) =>
    validate({
      req,
      res,
      next,
      schema: userValidation.resendVerificationEmail.body.validate(req.body),
    }),
  (req, res, next) =>
    userController.resendVerificationEmailController(req, res, next)
);

router.post(
  "/users/confirm-email/:token",
  (req, res, next) =>
    validate({
      req,
      res,
      next,
      schema: userValidation.confirmEmail.body.validate(req.params),
    }),
  (req, res, next) => userController.confirmEmailController(req, res, next)
);

router.post(
  "/users/login",
  (req, res, next) =>
    validate({
      req,
      res,
      next,
      schema: userValidation.loginUser.body.validate(req.body),
    }),
  (req, res, next) => userController.loginUserController(req, res, next)
);
router.use(protectRoutes);

router.get("/users/session", (req, res) =>
  userController.getUserSessionController(req, res)
);

module.exports = router;
