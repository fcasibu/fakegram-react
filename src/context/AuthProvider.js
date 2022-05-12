import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AuthContext from "./AuthContext";
import { auth } from "../firebase";

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [isLoading, setLoading] = useState(true);

  function signUp({ email, password }) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function signIn({ email, password }) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function signOut() {
    return auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
