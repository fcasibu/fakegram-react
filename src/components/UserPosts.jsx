import React from "react";
import PropTypes from "prop-types";
import { FiHeart, FiMessageCircle, FiBookmark } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import styles from "../styles/MainView.module.css";

function UserPosts({ users }) {
  const { currentUser } = useAuth();
  function filterUsers() {
    return users.filter(user => user.uid === currentUser.uid);
  }

  function renderPosts() {
    const following = users.filter(user => {
      return filterUsers()[0].following.includes(user.uid);
    });
    following.push(filterUsers()[0]);
    return following.map(user => {
      return user.posts.map((post, index) => {
        console.log(post);
        return (
          <div className={styles["post"]} key={index}>
            <div className={styles["post-top"]}>
              <img src={user.photoURL} />
              <h3>{user.displayName}</h3>
            </div>
            <img src={post.image} />
            <div className={styles["post-details"]}>
              <div className={styles["post-icons"]}>
                <div>
                  <FiHeart />
                  <FiMessageCircle />
                </div>
                <FiBookmark />
              </div>
              <div className={styles.likes}>{post.likes.length} likes</div>
              <div className={styles.comments}></div>
              <div className={styles.comment}>
                <form>
                  <input placeholder="Add a comment" />
                  <button type="submit">Post</button>
                </form>
              </div>
            </div>
          </div>
        );
      });
    });
  }

  return <div className={styles["posts"]}>{renderPosts()}</div>;
}

export default UserPosts;

UserPosts.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
};
