import React from "react";
import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth";
import styles from "../styles/MainView.module.css";
import { Link } from "react-router-dom";

function Suggestions({ users }) {
  const { currentUser } = useAuth();

  function filterUsers() {
    return users.filter(
      user =>
        !user.following.includes(currentUser.uid) &&
        user.uid !== currentUser.uid
    );
  }

  function renderUsers() {
    return filterUsers().map(user => {
      return (
        <Link to={`/${user.uid}`} className={styles.user} key={user.uid}>
          <img src={user.photoURL} />
          <h3>{user.displayName}</h3>
        </Link>
      );
    });
  }

  return (
    <>
      <Link to={`/${currentUser.uid}`} className={styles["current-user"]}>
        <img src={currentUser.photoURL} />
        <h3>{currentUser.displayName}</h3>
      </Link>
      <h3>Suggestions for you</h3>
      <div className={styles.users}>{renderUsers()}</div>
    </>
  );
}

export default Suggestions;

Suggestions.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
};
