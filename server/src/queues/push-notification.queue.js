const Queue = require("bull");
const webpush = require("web-push");
const eventTypes = require("../events/event.types");

// Create a queue for push notifications
const pushNotificationQueue = new Queue("pushNotificationQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

// Process the queue
pushNotificationQueue.process(async (job, done) => {
  const { subscription, payload, options } = job.data;

  try {
    await webpush.sendNotification(subscription, payload, options);
    done();
  } catch (error) {
    console.error("Error sending notification:", error);
    done(error);
  }
});

module.exports = pushNotificationQueue;
