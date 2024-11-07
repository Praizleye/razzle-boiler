const webpush = require("web-push");

// function generateVAPIDKeys() {
//   //   const vapidKeys = webpush.generateVAPIDKeys();

//   webpush.setVapidDetails(
//     "mailto:hello@homifiafrica.com",
//     "BBd9tZamPDyofPsgZRGJM2MV7BeLevdrI3VP5HIqUtEFGGCwCAxN48yYlmp0F-6Ltun0bxBpT4pAuZiMp_Q0U9E",
//     "joRti3rj2cwDTV03I_O-MfBbcyUnXOIxj11ZSNReBMk"
//   );
//   return;
// }

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

module.exports = sendWebPushNotification;
