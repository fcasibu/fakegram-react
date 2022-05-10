import React from "react";
import PropTypes from "prop-types";
import { updateProfile } from "firebase/auth";
import styles from "../styles/ProfileView.module.css";
import Header from "./Header";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

const ProfileView = React.memo(function ProfileView({ user }) {
  const { currentUser, followUser, unfollowUser } = useAuth();

  const isCurrentUser = user.uid === currentUser.uid;
  const isFollowing = user.followers.includes(currentUser.uid);

  function renderPosts() {
    return user.posts.map(post => {
      return (
        <div key={post.id}>
          <img src={post.image} />
        </div>
      );
    });
  }

  function followHandler() {
    followUser(user.uid, currentUser.uid);
  }

  function unfollowHandler() {
    unfollowUser(user.uid, currentUser.uid);
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
              <Link
                to="/profile/edit"
                style={!isCurrentUser ? { display: "none" } : {}}
              >
                Edit Profile
              </Link>
              {isCurrentUser ? null : !isFollowing ? (
                <button onClick={followHandler}>Follow</button>
              ) : (
                <button onClick={unfollowHandler}>Unfollow</button>
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
          <h3 style={!isCurrentUser ? { display: "none" } : {}}>Saved</h3>
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
