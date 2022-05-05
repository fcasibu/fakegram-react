import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import useAuth from "./hooks/useAuth";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

function PrivateRoute() {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
}

function App() {
  return (
    <Router basename="/">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Home />} />
            <Route path=":userID" element={<Profile />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
