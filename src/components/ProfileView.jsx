import React from "react";
import { db } from "../firebase";
import { updateProfile } from "firebase/auth";
import styles from "../styles/ProfileView.module.css";
import Header from "./Header";

const ProfileView = React.memo(function ProfileView({ user, currentUser }) {
  return (
    <div className="container">
      <Header />
      <div className={styles["profile-view"]}>
        <img src={user.photoURL} alt={user.displayName} />
        <div className={styles["profile-info"]}>
          <div className={styles["profile-info-top"]}>
            <h2>{user.displayName}</h2>
            <button>Edit Profile</button>
          </div>
          <div>
            <ul className={styles["profile-count"]}>
              <li>
                <h2>{user.posts.length}</h2>
                <p>posts</p>
              </li>
              <li>
                <h2>{user.followers}</h2>
                <p>followers</p>
              </li>
              <li>
                <h2>{user.following}</h2>
                <p>following</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProfileView;
