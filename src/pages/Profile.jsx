import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import ProfileView from "../components/ProfileView";
import { db } from "../firebase";
import { updateProfile } from "firebase/auth";
import { useParams } from "react-router-dom";
import useAsync from "../hooks/useAsync";

async function getData(userID) {
  console.log("hello");
  const data = await db.collection("users").get();
  return data.docs.filter(doc => doc.data().uid === userID)[0].data();
}

function Profile() {
  const { userID } = useParams();
  const { currentUser } = useAuth();
  const { status, error, data, runAsync } = useAsync();

  useEffect(() => {
    runAsync(getData(userID));
  }, [runAsync, userID]);

  // Create a new component instead
  if (status === "pending") return <div>Loading...</div>;

  if (status === "resolved") {
    return <ProfileView currentUser={currentUser} user={data} />;
  }
}

export default Profile;
