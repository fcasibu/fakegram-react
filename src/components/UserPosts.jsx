import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiHeart, FiMessageCircle, FiBookmark } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import styles from "../styles/MainView.module.css";
import { db } from "../firebase";
import { Link } from "react-router-dom";

// Duplicated code just for testing will refactor soon
function getUserFromDB(id) {
  return db.collection("users").doc(id);
}

async function setFollowState(getID, index, data) {
  const userData = await getUserFromDB(getID).get();
  const comment = userData.data().posts;
  comment[index].comments.push(data);
  getUserFromDB(getID).update(
    {
      posts: comment
    },
    { merge: true }
  );
}
function UserPosts({ users }) {
  const { currentUser } = useAuth();
  const [formValue, setFormValue] = useState("");

  function submitHandler(event) {
    const data = {
      displayName: currentUser.displayName,
      uid: currentUser.uid,
      comment: formValue
    };
    const uid = event.target.id;
    const { index } = event.target.dataset;
    event.preventDefault();
    setFollowState(uid, index, data);
    setFormValue("");
  }

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
              <div className={styles.comments}>
                {post.comments.map((comment, index) => {
                  return (
                    <div key={index} className={styles["user-comment"]}>
                      <Link to={comment.uid}>
                        <h3>{comment.displayName}</h3>
                      </Link>
                      <p>{comment.comment}</p>
                    </div>
                  );
                })}
              </div>
              <div className={styles.comment}>
                <form data-index={index} id={user.uid} onSubmit={submitHandler}>
                  <input
                    value={formValue}
                    onChange={e => setFormValue(e.target.value)}
                    placeholder="Add a comment"
                    minLength="4"
                    required
                  />
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
