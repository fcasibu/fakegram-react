import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../styles/MainView.module.css";

function Followings({ users }) {
  function renderUsers() {
    return users.map(user => {
      return (
        <Link to={`/${user.uid}`} key={user.uid}>
          <img src={user.photoURL} />
          <p>{user.displayName}</p>
        </Link>
      );
    });
  }

  return <div className={styles.followings}>{renderUsers()}</div>;
}

export default Followings;

Followings.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
};
