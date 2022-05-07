import React from "react";
import PropTypes from "prop-types";
import { db } from "../firebase";
import { updateProfile } from "firebase/auth";
import styles from "../styles/ProfileView.module.css";
import Header from "./Header";

function ProfileView({ user }) {
  function renderPosts() {
    return user.posts.map(post => {
      return (
        <div key={post.id}>
          <img src={post.image} />
        </div>
      );
    });
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
        <div className={styles.tabs}>
          <h3>Posts</h3>
          <h3>Saved</h3>
        </div>
        <div className={styles.posts}>{renderPosts()}</div>
      </div>
    </div>
  );
}

export default ProfileView;

ProfileView.propTypes = {
  user: PropTypes.shape({
    photoURL: PropTypes.string,
    displayName: PropTypes.string,
    posts: PropTypes.arrayOf(PropTypes.object),
    followers: PropTypes.number,
    following: PropTypes.number
  })
};
