import React from "react";
import styles from "../styles/Fallback.module.css";
import image from "../assets/loading.svg";
import Header from "./Header";

function FallbackLoading() {
  return (
    <div className="container">
      <Header />
      <div className={styles.loading}>
        <img src={image} />
      </div>
    </div>
  );
}

export default FallbackLoading;
