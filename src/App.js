import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import NavBar from "./components/NavBar";
import Dashboard from "./Dashboard";
import { AuthProvider } from "./Auth/AuthProvider";
import NotFound from "./NotFound";
import ProtectRoute from "./Auth/ProtectRoute";

const App = () => (
  <AuthProvider>
    <NavBar />
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route exact={true} path="/login" component={Login} />
      <Route exact={true} path="/register" component={Register} />
      <ProtectRoute exact={true} path="/dashboard">
        <Dashboard />
      </ProtectRoute>
      <Route component={NotFound} />
    </Switch>
  </AuthProvider>
);

export default App;
