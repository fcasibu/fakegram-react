import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import ProfileView from "../components/ProfileView";
import { db } from "../firebase";
import { updateProfile } from "firebase/auth";
import { useParams } from "react-router-dom";
import useAsync from "../hooks/useAsync";
import { doc, onSnapshot } from "firebase/firestore";

async function getData(userID) {
  const data = await db.collection("users").get();
  return data.docs.filter(doc => doc.data().uid === userID)[0].data();
}

function Profile() {
  const { userID } = useParams();
  const { currentUser } = useAuth();
  const { status, error, data, runAsync } = useAsync();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", userID), doc => {
      runAsync(getData(doc.data().uid));
    });

    return unsub;
  }, []);

  // Create a new component instead
  if (status === "pending") return <div>Loading...</div>;

  if (status === "resolved") {
    return <ProfileView currentUser={currentUser} user={data} />;
  }
}

export default Profile;
