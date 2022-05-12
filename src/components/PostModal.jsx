import React, { useRef, useState } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiMoreHorizontal
} from "react-icons/fi";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import styles from "../styles/Modal.module.css";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase";
import { formatDistance } from "date-fns";
import useModal from "../hooks/useModal";
import Modal from "./Modal";
import OptionsModal from "./OptionsModal";

function getUserFromDB(id) {
  return db.collection("users").doc(id);
}

function setUserFromDB(user, action) {
  getUserFromDB(user.posterId).update({
    [user.mainField]: action
  });
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

function PostModal({ user, closeModal }) {
  const { currentUser, unfollowUser } = useAuth();
  const { postId } = useParams();
  const [data, setData] = useState({});
  const { isModalOpen, closeModal: close, openModal } = useModal();
  const inputRef = useRef();
  const post = user.posts[postId];
  const time = new Date(post.createdAt.seconds * 1000);

  function likePost(event) {
    const likes = JSON.parse(event.target.dataset.likes);
    if (likes.includes(currentUser.uid)) {
      interact({
        uid: currentUser.uid,
        posterId: event.target.id,
        index: +event.target.dataset.index,
        mainField: "posts",
        subField: "likes",
        method: "filter"
      });
    } else {
      interact({
        posterId: event.target.id,
        index: +event.target.dataset.index,
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
      comment: inputRef.current.value
    };
    interact({
      posterId: event.target.id,
      index: +event.target.dataset.index,
      data,
      mainField: "posts",
      subField: "comments",
      method: "push"
    });
    inputRef.current.value = "";
  }

  function renderComments() {
    return post.comments.slice(-7).map((comment, index) => {
      return (
        <div key={index}>
          <Link to={`/${comment.uid}`} onClick={closeModal}>
            <h3>{comment.displayName}</h3>
          </Link>
          <p>{comment.comment}</p>
        </div>
      );
    });
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

  function showOptions(post, id, index) {
    setData({
      ...post,
      posterId: id,
      uid: currentUser.uid,
      postIndex: index,
      closeModal: close,
      deletePost,
      unfollowUser
    });
    openModal();
  }
  return (
    <div className={styles["post-modal"]}>
      {isModalOpen && (
        <Modal component={<OptionsModal data={data} />} closeModal={close} />
      )}
      <div className={styles["post-modal-image"]}>
        <img src={post.image} />
      </div>
      <div className={styles["post-modal-details"]}>
        <div className={styles["post-header"]}>
          <div>
            <img src={user.photoURL} />
            <h3>{user.displayName}</h3>
          </div>
          {currentUser.uid === user.uid && (
            <div onClick={() => showOptions(post, user.uid, postId)}>
              <FiMoreHorizontal />
            </div>
          )}
        </div>
        <div className={styles["post-body"]}>
          <div className={styles.poster}>
            <img src={user.photoURL} />
            <div>
              <h3>{user.displayName}</h3>
              <p>{post.caption}</p>
            </div>
          </div>
          <div className={styles["post-comments"]}>{renderComments()}</div>
          <div className={styles["post-icons"]}>
            <div>
              <div
                data-likes={JSON.stringify(post.likes)}
                data-index={postId}
                onClick={likePost}
                id={user.uid}
                className={
                  post.likes.includes(currentUser.uid)
                    ? styles["liked-post"]
                    : ""
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
          <div className={styles.liked}>{post.likes.length} likes</div>
          <div className={styles.date}>
            <p style={{ fontSize: "0.7rem" }}>
              {formatDistance(time, Date.now(), { addSuffix: true })
                .split("about")
                .join("")}
            </p>
          </div>
          <div className={styles["add-comment"]}>
            <form data-index={postId} id={user.uid} onSubmit={submitHandler}>
              <input
                ref={inputRef}
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
    </div>
  );
}

export default PostModal;

PostModal.propTypes = {
  user: PropTypes.shape({
    photoURL: PropTypes.string,
    displayName: PropTypes.string,
    uid: PropTypes.string,
    posts: PropTypes.arrayOf(PropTypes.object),
    followers: PropTypes.arrayOf(PropTypes.string),
    following: PropTypes.arrayOf(PropTypes.string)
  }),
  closeModal: PropTypes.func
};
