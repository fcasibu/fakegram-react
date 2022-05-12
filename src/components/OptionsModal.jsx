import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/Modal.module.css";
import { Link } from "react-router-dom";

function OptionsModal({ data }) {
  function unfollowHandler() {
    data.unfollowUser(data.posterId, data.uid);
    data.closeModal();
  }

  return (
    <div className={styles["options-modal"]}>
      {data.posterId !== data.uid && (
        <p onClick={unfollowHandler} style={{ color: "var(--danger)" }}>
          Unfollow
        </p>
      )}
      {data.posterId === data.uid && (
        <p
          data-index={data.postIndex}
          onClick={data.deletePost}
          style={{ color: "var(--danger)" }}
        >
          Delete
        </p>
      )}
      <Link to={`/${data.posterId}/${data.postIndex}`}>
        <p>Go to post</p>
      </Link>
      <p onClick={() => data.closeModal()}>Cancel</p>
    </div>
  );
}

export default OptionsModal;

OptionsModal.propTypes = {
  data: PropTypes.object
};
