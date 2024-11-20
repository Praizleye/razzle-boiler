// Push event - handle push notifications
self.addEventListener("push", (event) => {
  console.log("🚀 ~ self.addEventListener ~ event:", event);
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
      console.log("🚀 ~ self.addEventListener ~ data:", data);
    } catch (e) {
      console.error("Error parsing push event data:", e);
    }
  }
  self.registration.showNotification(data.title || "Default Title", {
    // can show the link in the body or pass any other data here
    body: `${data.body || "notified by Praise"}\n${
      data.link || "https://example.com"
    }`,
    icon: data.icon || "https://avatar.iran.liara.run/public/boy",
  });
});

// Notification click event - open the link in the notification or link to the app when clicked
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.link));
});
