const events = require("events");
const types = require("./event.types");
const emailHelpers = require("../helpers/email.helpers");
const sendWebPushNotification = require("../utils/web-push.util");

const eventEmitter = new events.EventEmitter();

eventEmitter.on(types.SEND_VERIFICATION_EMAIL, (payload) => {
  emailHelpers(payload);
  console.log("verification listener reached");
});

eventEmitter.on(types.SEND_PUSH_NOTIFICATION, (payload) => {
  sendWebPushNotification(payload);
});

module.exports = eventEmitter;
