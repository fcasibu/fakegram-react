import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiMoreHorizontal
} from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import styles from "../styles/MainView.module.css";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import Modal from "./Modal";
import OptionsModal from "./OptionsModal";
import useModal from "../hooks/useModal";
import useDatabase from "../hooks/useDatabase";

function UserPosts({ users }) {
  const { currentUser } = useAuth();
  const { unfollowUser, interact } = useDatabase();
  const [formValue, setFormValue] = useState("");
  const [data, setData] = useState({});
  const { openModal, closeModal, isModalOpen } = useModal();

  function likePost(likesList, index, id) {
    const likes = JSON.parse(likesList);
    if (likes.includes(currentUser.uid)) {
      interact({
        uid: currentUser.uid,
        posterId: id,
        index: index,
        mainField: "posts",
        subField: "likes",
        method: "filter"
      });
    } else {
      interact({
        posterId: id,
        index: index,
        data: currentUser.uid,
        mainField: "posts",
        subField: "likes",
        method: "push"
      });
    }
  }

  function showOptions(post, id, index) {
    setData({
      ...post,
      posterId: id,
      uid: currentUser.uid,
      postIndex: index,
      closeModal,
      deletePost,
      unfollowUser
    });
    openModal();
  }

  async function deletePost(event) {
    if (!window.confirm("Are you sure?")) return;
    interact({
      uid: currentUser.uid,
      posterId: currentUser.uid,
      index: +event.target.dataset.index,
      mainField: "posts",
      method: "splice"
    });
    closeModal();
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
    following.unshift(filterUsers()[0]);

    return following.map(user => {
      return user.posts.map((post, index) => {
        const time = new Date(post.createdAt.seconds * 1000);
        return (
          <div className={styles["post"]} key={index}>
            <div className={styles["post-top"]}>
              <Link to={`${user.uid}`}>
                <img src={user.photoURL} />
                <h3>{user.displayName}</h3>
              </Link>
              <div onClick={() => showOptions(post, user.uid, index)}>
                <FiMoreHorizontal />
              </div>
            </div>
            <img src={post.image} />
            <div className={styles["post-details"]}>
              <div className={styles["post-icons"]}>
                <div>
                  <div
                    onClick={() =>
                      likePost(JSON.stringify(post.likes), index, user.uid)
                    }
                    className={
                      post.likes.includes(currentUser.uid) ? styles.liked : ""
                    }
                  >
                    <FiHeart style={{ pointerEvents: "none" }} />
                  </div>
                  <FiMessageCircle />
                </div>
                <div>
                  <FiBookmark />
                </div>
              </div>
              <div className={styles.likes}>{post.likes.length} likes</div>
              <div className={styles.comments}>
                <div className={styles["user-comment"]}>
                  <h3>{user.displayName}</h3>
                  <p>{post.caption}</p>
                </div>
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
                <p style={{ fontSize: "0.7rem" }}>
                  {formatDistance(time, Date.now(), { addSuffix: true })
                    .split("about")
                    .join("")}
                </p>
              </div>
              <div className={styles.comment}>
                <form data-index={index} id={user.uid} onSubmit={submitHandler}>
                  <input
                    value={formValue}
                    onChange={e => setFormValue(e.target.value)}
                    placeholder="Add a comment"
                    minLength="4"
                    maxLength="55"
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

  return (
    <div className={styles["posts"]}>
      {isModalOpen && (
        <Modal
          component={<OptionsModal data={data} />}
          closeModal={closeModal}
        />
      )}
      {renderPosts()}
    </div>
  );
}

export default UserPosts;

UserPosts.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
};
