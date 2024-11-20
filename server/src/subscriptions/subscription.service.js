const emitEvent = require("../events/event.emitter");
const eventTypes = require("../events/event.types");
const {
  successHandler,
  customErrorHandler,
} = require("../middleware/error-handler.middleware");
const subscriptionSchema = require("./schema/save.subsription");
const pushNotificationQueue = require("../queues/push-notification.queue");
const webpush = require("web-push");

// this is the web-push package that is used to send the push notifications
// this details need be stored in the .env file
// they also need to be generated using the generateVAPIDKeys function
// they also need be set before sending the push notifications
// how to generate vapids keys is shown in the readme.md file
webpush.setVapidDetails(
  "mailto:hello@homifiafrica.com",
  "BBd9tZamPDyofPsgZRGJM2MV7BeLevdrI3VP5HIqUtEFGGCwCAxN48yYlmp0F-6Ltun0bxBpT4pAuZiMp_Q0U9E",
  "joRti3rj2cwDTV03I_O-MfBbcyUnXOIxj11ZSNReBMk"
);

function sendWebPushNotification(payload) {
  console.log("🚀 ~ sendWebPushNotification ~ payload: ~event", payload);
  webpush
    .sendNotification(
      payload.subscription,
      JSON.stringify(payload.payload),
      payload.options
    )
    .then(() => {
      console.log("Notification sent successfully");
    })
    .catch((err) => console.log(err));
}

// save the subscription to the database
async function saveSubscription(req, res, next) {
  console.log("🚀 ~ saveSubscription ~ req:", req.body);
  try {
    const existingSubscription = await subscriptionSchema.findOne({
      "subscription.endpoint": req.body.subscription.endpoint,
    });

    if (existingSubscription) {
      return customErrorHandler(400, "Subscription already exists", next);
    }

    const sub = new subscriptionSchema({
      subscription: {
        ...req.body.subscription,
      },
      userAgent: req.headers["user-agent"],
      userId: req.user._id,
    });

    const result = await sub.save();
    console.log("🚀 ~ saveSubscription ~ res:", result);

    if (result) {
      successHandler(
        res,
        { value: sub, message: "successfully subscribed to notifications" },
        200
      );
    }
  } catch (error) {
    customErrorHandler(500, error?.message, next);
  }
}

// get all the subscriptions for a user
async function getUsersSubscriptions(req, res, next) {
  try {
    const subscription = await subscriptionSchema.find({
      userId: req.user._id,
    });

    // remove the subscription object from the response
    // to avoid sending the subscription object to the client

    const copySubscription = JSON.parse(JSON.stringify(subscription));
    const refinedCopySubscription = copySubscription?.map((sub) => ({
      ...sub,
      subscription: {
        _id: sub.subscription._id,
      },
    }));

    if (refinedCopySubscription) {
      successHandler(
        res,
        { value: refinedCopySubscription, message: "subscriptions found" },
        200
      );
    }
  } catch (error) {
    customErrorHandler(500, error?.message, next);
  }
}

//
async function sendNotificationService(req, res, next) {
  try {
    const subscriptions = await subscriptionSchema.findOne({
      _id: req.params.id,
    });

    if (!subscriptions) {
      return customErrorHandler(404, "No subscriptions found", next);
    }

    const options = {
      TTL: 60, //time to live for push notification to know how long to keep the notification
    };

    // subscriptions property contains the subscription object
    // just extract the neccessary data from the subscription object
    // and pass it to the sendNotification
    const subscriptionObject = {
      endpoint: subscriptions.subscription.endpoint,
      keys: {
        auth: subscriptions.subscription.keys.auth,
        p256dh: subscriptions.subscription.keys.p256dh,
      },
    };

    const payload = { ...req.body.subscription };
    console.log("🚀 ~ sendNotificationService ~ payload:", payload);

    // !this is using the emit event to send the notifications
    // emitEvent(eventTypes.SEND_PUSH_NOTIFICATION, {
    //   subscription: subscriptionObject,
    //   payload,
    //   options,
    // });

    //! similarly you can decide to send the notifications without using the emit event and just push like this
    sendWebPushNotification({
      subscription: subscriptionObject,
      payload,
      options,
    });

    successHandler(res, { value: req.body, message: "Notification sent" }, 200);
  } catch (error) {
    customErrorHandler(500, error?.message, next);
  }
}
// send bulk notifications to all the subscriptions
async function sendBulkNotificationService(req, res, next) {
  try {
    const subscriptions = await subscriptionSchema.find({});

    if (!subscriptions || subscriptions.length === 0) {
      return customErrorHandler(404, "No subscriptions found", next);
    }

    const options = {
      TTL: 60,
    };

    const payload = JSON.stringify({
      title: req.body.title,
      message: req.body.message,
      link: req.body.link,
      icon: req.body.icon,
    });

    // get only the subscription object from the subscriptions array
    const subscriptionsObj = subscriptions.map((sub) => sub.subscription);

    // remove the _id property from the subscription object
    // to avoid sending the _id property to the weo-push as it will throw an error

    const refinedSubscriptions = subscriptionsObj.map((sub) => ({
      endpoint: sub.endpoint,
      keys: {
        auth: sub.keys.auth,
        p256dh: sub.keys.p256dh,
      },
    }));
    console.log(
      "🚀 ~ refinedSubscriptions ~ refinedSubscriptions:",
      refinedSubscriptions
    );

    // Add each subscription to the queue
    // !this is using the queue to send the notifications
    // refinedSubscriptions.forEach((subscription) => {
    //   pushNotificationQueue.add({
    //     subscription,
    //     payload,
    //     options,
    //   });
    // });

    // !this is sending the notifications without using the queue
    // just loop through the refinedSubscriptions and send the notifications
    // there is enough computing power to handle the notifications and if there are many subscriptions we create another replica of the server
    refinedSubscriptions.forEach((subscription) => {
      sendWebPushNotification({
        subscription,
        payload,
        options,
      });
    });

    successHandler(
      res,
      { value: req.body, message: "Notifications queued" },
      200
    );
  } catch (error) {
    customErrorHandler(500, error?.message, next);
  }
}

module.exports = {
  saveSubscription,
  getUsersSubscriptions,
  sendNotificationService,
  sendBulkNotificationService,
};
