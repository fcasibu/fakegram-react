import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth";
import styles from "../styles/MainView.module.css";

function filterUsers(users, currentUser) {
  return users.filter(user => user.uid === currentUser.uid)[0];
}

function filterFollowings(users, currentUser) {
  return users.filter(user => {
    return filterUsers(users, currentUser).following.includes(user.uid);
  });
}
function Followings({ users }) {
  const { currentUser } = useAuth();

  function renderUsers() {
    return filterFollowings(users, currentUser).map(user => {
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
