import React from "react";
import PropTypes from "prop-types";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import styles from "../styles/ProfileView.module.css";
import Header from "./Header";
import { Link } from "react-router-dom";
import useDatabase from "../hooks/useDatabase";

const ProfileView = React.memo(function ProfileView({ user, openModal }) {
  const { followUser, unfollowUser, currentUser } = useDatabase();
  const isCurrentUser = user.uid === currentUser.uid;
  const isFollowing = user.followers.includes(currentUser.uid);

  function renderPosts() {
    return user.posts.map((post, index) => {
      return (
        <div key={post.id} onClick={openModal} className={styles.post}>
          <div className={styles["post-info"]}>
            <div>
              <FiHeart />
              {post.likes.length}
            </div>
            <div>
              <FiMessageCircle />
              {post.comments.length}
            </div>
          </div>
          <Link to={`${index}`}>
            <img src={post.image} />
          </Link>
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
  }),
  openModal: PropTypes.func
};
