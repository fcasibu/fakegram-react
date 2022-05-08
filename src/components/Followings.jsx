import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth";
import styles from "../styles/MainView.module.css";

function Followings({ users }) {
  const { currentUser } = useAuth();
  function filterUsers() {
    return users.filter(user => user.uid === currentUser.uid);
  }

  function renderUsers() {
    // refactor
    const following = users.filter(user => {
      return filterUsers()[0].following.includes(user.uid);
    });
    return following.map(user => {
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
