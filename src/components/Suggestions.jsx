import React from "react";
import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth";
import styles from "../styles/MainView.module.css";
import { Link } from "react-router-dom";

function Suggestions({ users, followUser }) {
  const { currentUser } = useAuth();

  function filterUsers() {
    return users.filter(
      user =>
        !user.followers.includes(currentUser.uid) &&
        user.uid !== currentUser.uid
    );
  }

  function followHandler({ target: { id } }) {
    followUser(id, currentUser.uid);
  }

  function renderUsers() {
    return filterUsers().map(user => {
      return (
        <div key={user.uid} className={styles.user}>
          <Link to={`/${user.uid}`} className={styles.user}>
            <img src={user.photoURL} />
            <h3>{user.displayName}</h3>
          </Link>
          <button id={user.uid} onClick={followHandler}>
            Follow
          </button>
        </div>
      );
    });
  }

  return (
    <>
      <Link to={`/${currentUser.uid}`} className={styles["current-user"]}>
        <img src={currentUser.photoURL} />
        <h3>{currentUser.displayName}</h3>
      </Link>
      <div className={styles["all-users"]}>
        <h3>Suggestions for you</h3>
        <button>See All</button>
      </div>
      <div className={styles.users}>{renderUsers()}</div>
    </>
  );
}

export default Suggestions;

Suggestions.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  followUser: PropTypes.func
};
