import React from "react";
import styles from "../styles/Account.module.css";

function FormPage(props) {
  return (
    <div {...props} className={styles["form-page"]}>
      {props.children}
    </div>
  );
}

export default FormPage;
