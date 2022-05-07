import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAccount from "../hooks/useAccount";
import useForm from "../hooks/useForm";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

import styles from "../styles/Account.module.css";

const initialState = {
  email: "",
  displayName: "",
  password: ""
};

const DEFAULT_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/fakegram-react.appspot.com/o/default-avatar.png?alt=media&token=27cac4ea-06dd-48d4-abaa-1b4df4d64c8b";

function SignUp() {
  const { signUp } = useAuth();
  const { status, data, error, setState } = useAccount();
  const {
    formValues,
    buttonRef,
    changeVisibility,
    visibility,
    changeFormValues
  } = useForm(initialState);
  const { email, password, displayName } = formValues;
  const navigate = useNavigate();

  const validation =
    email.includes("@") && password.length > 5 && displayName.length > 5;

  useEffect(() => {
    buttonRef.current.disabled = !validation;
  }, [validation, buttonRef]);

  async function getSignUpData() {
    if (status === "resolved") {
      buttonRef.current.disabled = true;
      try {
        await signUp(data).then(async ({ user }) => {
          await setDoc(doc(db, "users", user.uid), {
            displayName: data.displayName,
            email: user.email,
            photoURL: DEFAULT_AVATAR,
            uid: user.uid,
            posts: [],
            saved: [],
            followers: [],
            following: []
          });
          await updateProfile(user, {
            photoURL: DEFAULT_AVATAR,
            displayName: data.displayName
          });
        });
        navigate("/");
      } catch {
        setState({
          type: "rejected",
          error: "Email is already in use by another account"
        });
        changeFormValues({ id: email, value: "" });
      }
    }
  }

  useEffect(() => {
    if (status === "idle") return;
    getSignUpData();
  }, [status, data]);

  function handleCheckbox(event) {
    changeVisibility(event.target.checked);
  }

  function handleChange(event) {
    changeFormValues(event.target);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setState({ type: "resolved", data: formValues });
  }

  return (
    <div className={styles.container}>
      <div className={styles["form-page"]}>
        <div>
          <h2>Fakegram</h2>
          <p>Sign up to see posts from other people!</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            value={email}
            onChange={handleChange}
            id="email"
            type="email"
            placeholder="Email Address"
          />
          <input
            value={displayName}
            onChange={handleChange}
            id="displayName"
            type="text"
            placeholder="Display Name"
          />
          <div className={styles["password-box"]}>
            <input
              value={password}
              onChange={handleChange}
              id="password"
              type={visibility ? "text" : "password"}
              placeholder="Password"
            />
            <div className={styles.checkbox}>
              <label htmlFor="sign-up-checkbox">
                {password.length ? (visibility ? "Hide" : "Show") : null}
              </label>
              <input
                id="sign-up-checkbox"
                type="checkbox"
                onChange={handleCheckbox}
              />
            </div>
          </div>
          <button ref={buttonRef} type="submit">
            {status === "resolved" ? "Loading..." : "Sign up"}
          </button>
        </form>
        <div className={styles.error} role="alert">
          {error && error}
        </div>
        <div>
          <p>
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
