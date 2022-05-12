import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import useForm from "../hooks/useForm";
import styles from "../styles/EditProfile.module.css";
import useDatabase from "../hooks/useDatabase";

function EditProfile() {
  const { currentUser, changePhoto, updateUserInfo } = useDatabase();
  const { formValues, changeFormValues, buttonRef } = useForm(() => {
    return { displayName: currentUser.displayName, email: currentUser.email };
  });
  const navigate = useNavigate();

  const validation =
    formValues.email.includes("@") && formValues.displayName.length > 5;

  useEffect(() => {
    buttonRef.current.disabled = !validation;
  }, [validation, buttonRef]);

  function handleUpload(event) {
    changePhoto(event.target.files[0]);
  }

  function handleChange(event) {
    changeFormValues(event.target);
  }

  function handleSubmit(event) {
    event.preventDefault();
    updateUserInfo(currentUser, formValues);
    navigate(`/${currentUser.uid}`);
  }

  return (
    <>
      <Header />
      <div className={styles["edit-container"]}>
        <div className={styles["profile-info"]}>
          <div>
            <img src={currentUser.photoURL} />
          </div>
          <div>
            <h3>{currentUser.displayName}</h3>
            <label htmlFor="change-avatar">
              <span>Change Profile Photo</span>
              <input id="change-avatar" type="file" onChange={handleUpload} />
            </label>
          </div>
        </div>
        <div className={styles["input-fields"]}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">
              <span>Username</span>
              <input
                id="displayName"
                value={formValues.displayName}
                maxLength="12"
                pattern="[a-zA-Z0-9]+"
                onChange={handleChange}
                type="text"
                required
              />
            </label>
            <button ref={buttonRef} type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
