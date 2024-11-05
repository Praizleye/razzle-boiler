import React, { useEffect } from "react";
import logo from "./panda.jpg";
import { useAuth } from "./Auth/AuthProvider";
const Home = () => {
  const { loading, user } = useAuth();
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const subscribeUser = async () => {
    const publicKey =
      "BBd9tZamPDyofPsgZRGJM2MV7BeLevdrI3VP5HIqUtEFGGCwCAxN48yYlmp0F-6Ltun0bxBpT4pAuZiMp_Q0U9E";

    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        // console.log("🚀 ~ subscribeUser ~ registration:", registration);
        try {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          });

          // console.log("🚀 ~ subscribeUser ~ subscription:", subscription);

          await fetch("http://localhost:8475/api/subscribe", {
            method: "POST",
            body: JSON.stringify({ subscription }), //you can pass meta data here
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
        } catch (subscriptionError) {
          console.error("Error during push subscription:", subscriptionError);
        }
      } catch (error) {
        console.error("Error during service worker registration:", error);
      }
    }
  };

  const enableNotifications = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setIsSubscribed(true);
      console.log("Notification permission granted.");
    } else {
      console.log(
        "Permission denied, please enable notifications in the browser settings."
      );
    }
  };

  React.useEffect(() => {
    enableNotifications();
  }, []);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return (
    <>
      {/* nav bar goes here */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          textAlign: "center",
        }}
      >
        <div>
          <h1>Push Notifications Made easy.</h1>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <button
            onClick={enableNotifications}
            style={{
              padding: "1rem 2rem",
              marginBottom: "2rem",
              fontSize: "1rem",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Enable Notifications
          </button>
          {/* <button
            onClick={subscribeUser}
            style={{
              padding: "1rem 2rem",
              marginBottom: "2rem",
              fontSize: "1rem",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Test Notification
          </button> */}
          {user && isSubscribed && (
            <button
              onClick={subscribeUser}
              style={{
                padding: "1rem 2rem",
                marginBottom: "2rem",
                fontSize: "1rem",
                cursor: "pointer",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Subscribe
            </button>
          )}
        </div>
        <img
          src={logo}
          alt="React Logo"
          width="400px"
          height="auto"
          style={{
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "200px",
            height: "auto",
            objectFit: "cover",
          }}
        />
      </div>
    </>
  );
};

export default Home;
