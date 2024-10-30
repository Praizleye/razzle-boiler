import React from "react";
import logo from "./react.svg";
import "./Home.css";

function Home() {
  const handleNotification = () => {
    if (typeof window === "undefined") {
      return null;
    }
    if (window.Notification) {
      if (window.Notification.permission === "granted") {
        new Notification("Hi there!");
      } else if (window.Notification.permission !== "denied") {
        window.Notification.requestPermission().then((permission) => {
          console.log("Notification permission is ", permission);
          if (permission === "granted") {
            new Notification("Hi there!");
          }
        });
      } else {
        console.log(
          "Notification permission has been denied previously. Please enable it in your browser settings."
        );
      }
    }
    return null;
  };

  return (
    <div>
     
      <div className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <h2>Welcome to Razzle</h2>
      </div>
      <button onClick={handleNotification}>Enable Notification</button>
    </div>
  );
}

export default Home;
