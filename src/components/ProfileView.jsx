import React from "react";
import PropTypes from "prop-types";
import { db, firebase } from "../firebase";
import { updateProfile } from "firebase/auth";
import styles from "../styles/ProfileView.module.css";
import Header from "./Header";
import useAuth from "../hooks/useAuth";

function getUserFromDB(id) {
  return db.collection("users").doc(id);
}

function setFollowState(getID, setID, field, state = "arrayUnion") {
  getUserFromDB(getID).set(
    {
      [field]: firebase.firestore.FieldValue[state](setID)
    },
    { merge: true }
  );
}

const ProfileView = React.memo(function ProfileView({ user }) {
  const { currentUser } = useAuth();

  const isCurrentUser = user.uid === currentUser.uid;
  const isFollowing = user.followers.includes(currentUser.uid);
  console.log(currentUser.uid);
  function renderPosts() {
    return user.posts.map(post => {
      return (
        <div key={post.id}>
          <img src={post.image} />
        </div>
      );
    });
  }

  function followUser() {
    setFollowState(user.uid, currentUser.uid, "followers");
    setFollowState(currentUser.uid, user.uid, "following");
  }

  function unfollowUser() {
    setFollowState(user.uid, currentUser.uid, "followers", "arrayRemove");
    setFollowState(currentUser.uid, user.uid, "following", "arrayRemove");
  }

  return (
    <div className="container">
      <Header />
      <div className={styles.profile}>
        <div className={styles["profile-view"]}>
          <img src={user.photoURL} alt={user.displayName} />
          <div className={styles["profile-info"]}>
            <div className={styles["profile-info-top"]}>
              <h2>{user.displayName}</h2>
              <button>Edit Profile</button>
              {isCurrentUser ? null : !isFollowing ? (
                <button onClick={followUser}>Follow</button>
              ) : (
                <button onClick={unfollowUser}>Unfollow</button>
              )}
            </div>
            <div>
              <ul className={styles["profile-count"]}>
                <li>
                  <h2>{user.posts.length}</h2>
                  <p>posts</p>
                </li>
                <li>
                  <h2>{user.followers.length}</h2>
                  <p>followers</p>
                </li>
                <li>
                  <h2>{user.following.length}</h2>
                  <p>following</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.tabs}>
          <h3>Posts</h3>
          <h3>Saved</h3>
        </div>
        <div className={styles.posts}>{renderPosts()}</div>
      </div>
    </div>
  );
});

export default ProfileView;

ProfileView.propTypes = {
  user: PropTypes.shape({
    photoURL: PropTypes.string,
    displayName: PropTypes.string,
    uid: PropTypes.string,
    posts: PropTypes.arrayOf(PropTypes.object),
    followers: PropTypes.arrayOf(PropTypes.string),
    following: PropTypes.arrayOf(PropTypes.string)
  })
};
