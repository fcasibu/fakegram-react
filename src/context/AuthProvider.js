import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import auth from "../firebase";

function AuthProvider({ children }) {
  const [currentUser, setCurretUser] = useState();

  function signUp({ email, password }) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function signIn({ email, password }) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurretUser(user);
    });

    return unsubscribe;
  });

  const value = {
    currentUser,
    signUp,
    signIn,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;