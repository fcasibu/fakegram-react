import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAccount from "../hooks/useAccount";
import useForm from "../hooks/useForm";
import styles from "../styles/Account.module.css";

const initialState = {
  email: "",
  password: "",
};

function checkErrorType(code) {
  let message;
  if (code === "auth/wrong-password") {
    message = "You have entered an invalid password";
  } else if (code === "auth/user-not-found") {
    message = "The email you entered doesn't belong to an account";
  } else if (code === "auth/too-many-requests") {
    message =
      "Access to this account has been temporarily disabled due to many failed login attempts.";
  }

  return message;
}

function SignIn() {
  const { signIn } = useAuth();
  const { status, data, error, setState } = useAccount({
    data: initialState,
  });
  const {
    formValues,
    buttonRef,
    changeVisibility,
    visibility,
    changeFormValues,
  } = useForm(initialState);
  const { email, password } = formValues;

  const validation = email.includes("@") && password.length > 5;

  useEffect(() => {
    buttonRef.current.disabled = true;
    if (validation) {
      buttonRef.current.disabled = false;
    }
  }, [validation]);

  useEffect(() => {
    if (status === "idle") return;
    async function getSignInData() {
      if (status === "resolved") {
        buttonRef.current.disabled = true;
        try {
          await signIn(data);
          setState({ type: "idle" });
        } catch (error) {
          const message = checkErrorType(error.code);
          setState({ type: "rejected", error: message });
          buttonRef.current.disabled = false;
        }
      }
    }
    getSignInData();
  }, [data]);

  function handleCheckbox(event) {
    changeVisibility(event.target.checked);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setState({ type: "resolved", data: formValues });
  }

  function handleChange(event) {
    changeFormValues(event.target);
  }

  return (
    <div className={styles["form-page"]}>
      <div>
        <h2>Site Logo</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={handleChange} id="email" type="email" />
        <div className={styles["password-box"]}>
          <input
            value={password}
            onChange={handleChange}
            id="password"
            type={visibility ? "text" : "password"}
          />
          <div className={styles.checkbox}>
            <label htmlFor="sign-in-checkbox">
              {password.length ? (visibility ? "Hide" : "Show") : null}
            </label>
            <input
              id="sign-in-checkbox"
              className={styles.checkbox}
              type="checkbox"
              onChange={handleCheckbox}
            />
          </div>
        </div>
        <button ref={buttonRef} type="submit">
          {status === "resolved" ? "Loading..." : "Sign in"}
        </button>
      </form>
      <div>{error && error}</div>
      <div>
        <p>
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
