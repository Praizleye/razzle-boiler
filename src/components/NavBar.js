import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../Auth/AuthProvider";
export default function NavBar() {
  const { user, loading } = useAuth();
  return (
    <div style={{ height: "auto", display: "flex", justifyContent: "center" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          //   alignItems: "center",
          padding: "1rem 2rem",
          margin: "2rem 0",
          backgroundColor: "#282c34",
          color: "white",
          width: "auto",
          gap: "2rem",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Dashboard
          </Link>
        </div>
        <div>
          <Link
            to="/login"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            {loading ? "Loading..." : user ? "Logout" : "Login"}
          </Link>
        </div>
        <div>{user && `${user.firstName} ${user.lastName}`}</div>
      </nav>
    </div>
  );
}
