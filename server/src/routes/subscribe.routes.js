const express = require("express");
const router = express.Router();
const subscriptionValidation = require("../subscriptions/validation/save.validation");
const {
  createUsersSubsription,
  getSubscriptions,
  sendNotification,
  sendBulkNotificationController,
} = require("../subscriptions/subscription.controller");
const validate = require("../middleware/custom-validation.middleware");

router.post(
  "/subscribe",
  (req, res, next) =>
    validate({
      req,
      res,
      next,
      schema: subscriptionValidation.saveSubscription.body.validate(req.body),
    }),
  (req, res, next) => createUsersSubsription(req, res, next)
);

router.get("/user-subscriptions", (req, res, next) =>
  getSubscriptions(req, res, next)
);

router.post("/send-notification/:id", (req, res, next) => {
  sendNotification(req, res, next);
});

router.post("/send-bulk-notifications", (req, res, next) => {
  sendBulkNotificationController(req, res, next);
});

module.exports = router;
