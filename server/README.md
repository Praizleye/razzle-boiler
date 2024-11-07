# README

## Generating VAPID Keys

To generate VAPID keys, you can use the `web-push` library. Follow the steps below:

1. Install the `web-push` library if you haven't already:

```bash
npm install web-push
```

2. Generate the VAPID keys using the following script:

```javascript
const webpush = require("web-push");

const vapidKeys = webpush.generateVAPIDKeys();

console.log("Public Key:", vapidKeys.publicKey);
console.log("Private Key:", vapidKeys.privateKey);
```

This script will output the public and private VAPID keys. Make sure to store these keys securely.

## Setting VAPID Keys via WebPush

Once you have generated the VAPID keys, you need to set them in your application using the `web-push` library. Here is how you can do it:

1. Import the `web-push` library and set the VAPID keys:

```javascript
const webpush = require("web-push");

// Replace with your generated VAPID keys
const vapidPublicKey = "YOUR_PUBLIC_KEY";
const vapidPrivateKey = "YOUR_PRIVATE_KEY";

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  vapidPublicKey,
  vapidPrivateKey
);
```

2. Store the VAPID keys securely, for example, in environment variables or a secure configuration file.

3. Use the `webpush` library to send push notifications:

```javascript
const pushSubscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/...",
  keys: {
    auth: "...",
    p256dh: "...",
  },
};

const payload = JSON.stringify({ title: "Test Notification" });

webpush
  .sendNotification(pushSubscription, payload)
  .then((response) => console.log("Notification sent successfully:", response))
  .catch((error) => console.error("Error sending notification:", error));
```

By following these steps, you can generate VAPID keys and set them up in your application to send push notifications using the `web-push` library.

- This is merely an MVP but showcases a very secure authentication strategy that can scale and provides a well thought out auth strategy.
- link to github page. https://github.com/Praizleye/fresh-tech/tree/master
- link to schematic diagram. https://drawsql.app/teams/praizdcoder/diagrams/fresh-tech
  \*feel free to fork this repo and contribute to its awesomeness.

* reach me at my twitter https://x.com/Praiz_DcoDer?t=2pWd4_5G0y0LQa5mFavHYA&s=09
