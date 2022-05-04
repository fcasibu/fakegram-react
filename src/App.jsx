import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

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
