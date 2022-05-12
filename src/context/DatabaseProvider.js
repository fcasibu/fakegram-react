import React from "react";
import PropTypes from "prop-types";
import DatabaseContext from "./DatabaseContext";
import { db, storage, firebase } from "../firebase";
import { updateProfile } from "firebase/auth";
import useAuth from "../hooks/useAuth";

function getUserFromDB(id) {
  return db.collection("users").doc(id);
}

function setUserFromDB(user, action) {
  getUserFromDB(user.posterId).update({
    [user.mainField]: action
  });
}

function updateUserInfo(user, formValues) {
  updateProfile(user, { ...formValues });
  getUserFromDB(user.uid).update({ ...formValues });
}

function filterData(user, action) {
  return (action[user.index][user.subField] = action[user.index][
    user.subField
  ].filter(id => id !== user.uid));
}

function removeData(user, action) {
  return action[user.method](user.index, 1);
}

function addData(user, action) {
  return action[user.index][user.subField][user.method](user.data);
}

function method(user, action) {
  switch (user.method) {
    case "filter":
      return filterData(user, action);
    case "push":
      return addData(user, action);
    case "splice":
      return removeData(user, action);
    default:
      throw new Error(`Unknown method: ${user.method}`);
  }
}

async function interact(user) {
  const userData = await getUserFromDB(user.posterId).get();
  const action = userData.data()[user.mainField];
  method(user, action);
  setUserFromDB(user, action);
}

function setFollowState(getID, setID, field, state = "arrayUnion") {
  getUserFromDB(getID).update({
    [field]: firebase.firestore.FieldValue[state](setID)
  });
}

function imageRef(id, img) {
  return storage.ref(`/images/${id}/${img.name}`);
}

async function isImagePosted(uid, img) {
  const getData = await getUserFromDB(uid).get();
  return getData.data().posts.some(post => post.id === img.name);
}

function postImage(uid, img, caption = "") {
  imageRef(uid, img)
    .getDownloadURL()
    .then(url => {
      getUserFromDB(uid).update({
        posts: firebase.firestore.FieldValue.arrayUnion({
          poster: uid,
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

function DatabaseProvider({ children }) {
  const { currentUser } = useAuth();

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

  async function addPost(img, caption) {
    if (await isImagePosted(currentUser.uid, img)) return;
    await imageRef(currentUser.uid, img).put(img);
    postImage(currentUser.uid, img, caption);
  }

  const value = {
    currentUser,
    changePhoto,
    followUser,
    unfollowUser,
    addPost,
    interact,
    updateUserInfo
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export default DatabaseProvider;

DatabaseProvider.propTypes = {
  children: PropTypes.node.isRequired
};
