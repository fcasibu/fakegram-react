import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";

import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";

function App() {
  return (
    <Router basename="/">
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
