import React from "react";
import { useAuth } from "./Auth/AuthProvider";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  const [mySubscriptions, setMySubscriptions] = React.useState([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = React.useState(false);
  const [loadingSend, setLoadingSend] = React.useState(false);
  const [loadingBulk, setLoadingBulk] = React.useState(false);

  function getMySubscriptions() {
    setLoadingSubscriptions(true);
    fetch(`${process.env.RAZZLE_SERVER_BASE_URL}/api/user-subscriptions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("🚀 ~ .then ~ data:", data);
        setMySubscriptions(data?.message?.value || []);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoadingSubscriptions(false);
      });
  }

  React.useEffect(() => {
    getMySubscriptions();
  }, []);

  function sendTestNotification(id, subscription) {
    setLoadingSend(true);
    fetch(`${process.env.RAZZLE_SERVER_BASE_URL}/api/send-notification/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ subscription }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("🚀 ~ .then ~ data:", data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoadingSend(false);
      });
  }

  function sendBulkNotifications(subscription) {
    setLoadingBulk(true);
    fetch(`${process.env.RAZZLE_SERVER_BASE_URL}/api/send-bulk-notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ subscription }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("🚀 ~ .then ~ data:", data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoadingBulk(false);
      });
  }

  return (
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
      <div>{loading ? "Loading..." : "Dashboard"}</div>

      <div>
        <h1>Welcome {user?.firstName}</h1>
      </div>

      <div>
        <div>My subsciptions</div>

        {loadingSubscriptions ? (
          <div>Loading...</div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              marginTop: "2rem",
            }}
          >
            {mySubscriptions.map((sub) => (
              <div
                key={sub.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  width: "200px",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ fontWeight: "bold", flex: 1 }}>
                  {user?.firstName + " " + user?.lastName}
                </div>
                <div>{sub?.userAgent}</div>
                <button
                  onClick={() =>
                    sendTestNotification(sub._id, {
                      title: "Test Notification",
                      body: "This is a test notification",
                      link: "https://www.npmjs.com/package/web-push",
                      icon: "https://avatar.iran.liara.run/public/boy",
                    })
                  }
                  style={{
                    marginTop: "1rem",
                    padding: "1rem 2rem",
                    marginBottom: "1rem",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  {loadingSend ? "Sending..." : "Send Test"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "1rem",
        }}
      >
        <button
          style={{
            marginTop: "1rem",
            padding: "1rem 2rem",
            marginBottom: "1rem",
            fontSize: "0.8rem",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() =>
            sendBulkNotifications({
              title: "Test Notification",
              body: "This is a test notification",
              link: "https://www.npmjs.com/package/web-push",
              icon: "https://avatar.iran.liara.run/public/boy",
            })
          }
        >
          Send Bulk Notifications
        </button>
      </div>
    </div>
  );
}
