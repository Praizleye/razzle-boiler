const {
  saveSubscription,
  getUsersSubscriptions,
  sendNotificationService,
  sendBulkNotificationService,
} = require("./subscription.service");

function createUsersSubsription(req, res, next) {
  // console.log("🚀 ~ createUsersSubsription ~ res:", res);
  return saveSubscription(req, res, next);
}

function getSubscriptions(req, res, next) {
  return getUsersSubscriptions(req, res, next);
}

function sendNotification(req, res, next) {
  return sendNotificationService(req, res, next);
}

function sendBulkNotificationController(req, res, next) {
  return sendBulkNotificationService(req, res, next);
}
module.exports = {
  createUsersSubsription,
  getSubscriptions,
  sendNotification,
  sendBulkNotificationController,
};
