import React, { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    signInApiRequest(data);
  }

  async function signInApiRequest(data) {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.RAZZLE_SERVER_BASE_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "85dvh",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", width: "300px" }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div
          style={{
            marginBottom: "15px",
            // background: "green",
            width: "100%",
            position: "relative",
          }}
        >
          <label
            style={{
              marginBottom: "10px",
              //   background: "yellow",
            }}
          >
            Password:
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                // transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </label>
        </div>
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
        <div style={{ marginTop: "10px" }}>
          <a href="/register" style={{ color: "#4CAF50" }}>
            New user? Sign up here
          </a>
        </div>
      </form>
    </div>
  );
}
