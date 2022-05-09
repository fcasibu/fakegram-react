import React from "react";
import PropTypes from "prop-types";
import Followings from "./Followings";
import styles from "../styles/MainView.module.css";
import Suggestions from "./Suggestions";
import UserPosts from "./UserPosts";

function MainView({ users }) {
  return (
    <main className={styles.main}>
      <div className={styles["left-section"]}>
        <Followings users={users} />
        <UserPosts users={users} />
      </div>
      <div className={styles["right-section"]}>
        <Suggestions users={users} />
      </div>
    </main>
  );
}

export default MainView;

MainView.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
};
