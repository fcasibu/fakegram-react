import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Followings from "./Followings";
import styles from "../styles/MainView.module.css";
import Suggestions from "./Suggestions";
import useAuth from "../hooks/useAuth";
import UserPosts from "./UserPosts";

function MainView({ users }) {
  const { followUser } = useAuth();

  return (
    <main className={styles.main}>
      <div className={styles["left-section"]}>
        <Followings users={users} />
        <UserPosts users={users} />
      </div>
      <div className={styles["right-section"]}>
        <Suggestions followUser={followUser} users={users} />
      </div>
    </main>
  );
}

export default MainView;

MainView.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
};
