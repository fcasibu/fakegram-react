import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AuthContext from "./AuthContext";
import { auth, db, storage, firebase } from "../firebase";
import { updateProfile } from "firebase/auth";

function getUserFromDB(id) {
  return db.collection("users").doc(id);
}

function setFollowState(getID, setID, field, state = "arrayUnion") {
  getUserFromDB(getID).update({
    [field]: firebase.firestore.FieldValue[state](setID)
  });
}

function usersCollection(id) {
  return db.collection("users").doc(id);
}

function imageRef(id, img) {
  return storage.ref(`/images/${id}/${img.name}`);
}

async function isImagePosted(uid, img) {
  const getData = await usersCollection(uid).get();
  return getData.data().posts.some(post => post.id === img.name);
}

function postImage(uid, img, caption = "") {
  imageRef(uid, img)
    .getDownloadURL()
    .then(url => {
      usersCollection(uid).update({
        posts: firebase.firestore.FieldValue.arrayUnion({
          caption,
          image: url,
          comments: [],
          likes: [],
          id: img.name,
          createdAt: firebase.firestore.Timestamp.now()
        })
      });
    });
}

function updatePhoto(currentUser, img) {
  imageRef(currentUser.uid, img)
    .getDownloadURL()
    .then(url => {
      getUserFromDB(currentUser.uid).update({
        photoURL: url
      });
      updateProfile(currentUser, { photoURL: url });
    });
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  function signUp({ email, password }) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function signIn({ email, password }) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  async function addPost(img, caption) {
    if (await isImagePosted(currentUser.uid, img)) return;
    await imageRef(currentUser.uid, img).put(img);
    postImage(currentUser.uid, img, caption);
  }

  async function changePhoto(img) {
    await imageRef(currentUser.uid, img).put(img);
    updatePhoto(currentUser, img);
  }

  function followUser(user, currentUser) {
    setFollowState(user, currentUser, "followers");
    setFollowState(currentUser, user, "following");
  }

  function unfollowUser(user, currentUser) {
    setFollowState(user, currentUser, "followers", "arrayRemove");
    setFollowState(currentUser, user, "following", "arrayRemove");
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signUp,
    signIn,
    addPost,
    changePhoto,
    followUser,
    unfollowUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
