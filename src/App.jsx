import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";

import SignUp from "./components/SignUp";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
