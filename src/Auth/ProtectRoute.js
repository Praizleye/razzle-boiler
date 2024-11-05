import React from "react";
import { useAuth } from "./AuthProvider";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";

export default function ProtectRoute({ component: Component, ...rest }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loading && !user) {
    return <Redirect to="/login" />;
  }

  if (!loading && user) {
    return <Route {...rest}></Route>;
  }

  return null;
}
