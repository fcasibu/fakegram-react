import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAccount from "../hooks/useAccount";
import useForm from "../hooks/useForm";
import styles from "../styles/Account.module.css";

const initialState = {
  email: "",
  displayName: "",
  password: "",
};

function SignUp() {
  const { signUp } = useAuth();
  const { status, data, error, setState } = useAccount();
  const {
    formValues,
    buttonRef,
    changeVisibility,
    visibility,
    changeFormValues,
  } = useForm(initialState);
  const { email, password, displayName } = formValues;

  const validation =
    email.includes("@") && password.length > 5 && displayName.length > 5;

  useEffect(() => {
    buttonRef.current.disabled = true;
    if (validation) {
      buttonRef.current.disabled = false;
    }
  }, [validation]);

  useEffect(() => {
    if (status === "idle") return;
    async function getSignUpData() {
      if (status === "resolved") {
        buttonRef.current.disabled = true;
        try {
          await signUp(data);
          setState({ type: "idle" });
        } catch {
          setState({
            type: "rejected",
            error: "Email is already in use by another account",
          });
          changeFormValues({ id: email, value: "" });
        }
      }
    }

    getSignUpData();
  }, [data]);

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
    <div className={styles["form-page"]}>
      <div>
        <h2>Site Logo</h2>
        <p>Sign up to see posts from other people!</p>
      </div>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={handleChange} id="email" type="email" />
        <input
          value={displayName}
          onChange={handleChange}
          id="displayName"
          type="text"
        />
        <div className={styles["password-box"]}>
          <input
            value={password}
            onChange={handleChange}
            id="password"
            type={visibility ? "text" : "password"}
          />

          <input
            className={styles.checkbox}
            type="checkbox"
            onChange={handleCheckbox}
          />
        </div>
        <button ref={buttonRef} type="submit">
          {status === "resolved" ? "Loading..." : "Sign up"}
        </button>
      </form>
      <div>{error && error}</div>
      <div>
        <p>
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
