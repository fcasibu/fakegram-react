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

function setUserFromDB(user, action) {
  getUserFromDB(user.posterId).update({
    [user.mainField]: action
  });
}

function removeData(user, action) {
  return (action[user.index][user.subField] = action[user.index][
    user.subField
  ].filter(id => id !== user.uid));
}

function addData(user, action) {
  return action[user.index][user.subField][user.method](user.data);
}

async function interact(user) {
  const userData = await getUserFromDB(user.posterId).get();
  const action = userData.data()[user.mainField];
  user.method !== "filter" ? addData(user, action) : removeData(user, action);
  setUserFromDB(user, action);
}
function UserPosts({ users }) {
  const { currentUser } = useAuth();
  const [formValue, setFormValue] = useState("");

  function likePost(event) {
    const likes = JSON.parse(event.target.dataset.likes);
    if (likes.includes(currentUser.uid)) {
      interact({
        uid: currentUser.uid,
        posterId: event.target.id,
        index: event.target.dataset.index,
        data: null,
        mainField: "posts",
        subField: "likes",
        method: "filter"
      });
    } else {
      interact({
        posterId: event.target.id,
        index: event.target.dataset.index,
        data: currentUser.uid,
        mainField: "posts",
        subField: "likes",
        method: "push"
      });
    }
  }

  function submitHandler(event) {
    event.preventDefault();
    const data = {
      displayName: currentUser.displayName,
      uid: currentUser.uid,
      comment: formValue
    };
    interact({
      posterId: event.target.id,
      index: +event.target.dataset.index,
      data,
      mainField: "posts",
      subField: "comments",
      method: "push"
    });
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
            <Link to={`/${user.uid}`} className={styles["post-top"]}>
              <img src={user.photoURL} />
              <h3>{user.displayName}</h3>
            </Link>
            <img src={post.image} />
            <div className={styles["post-details"]}>
              <div className={styles["post-icons"]}>
                <div>
                  <div
                    data-likes={JSON.stringify(post.likes)}
                    data-index={index}
                    id={user.uid}
                    onClick={likePost}
                    className={
                      post.likes.includes(currentUser.uid) ? styles.liked : ""
                    }
                  >
                    <FiHeart style={{ pointerEvents: "none" }} />
                  </div>
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
                    maxLength="60"
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
