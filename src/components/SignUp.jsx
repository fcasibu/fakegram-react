import React, { useState, useReducer, useRef, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import styles from "../styles/SignUp.module.css";

function stateReducer(state, action) {
  switch (action.type) {
    case "idle": {
      return { status: "idle", data: null, error: null };
    }
    case "resolved": {
      return { status: "resolved", data: action.data, error: null };
    }
    case "rejected": {
      return { status: "rejected", data: null, error: action.error };
    }
    default: {
      throw new Error(`Unexpected action type: ${action.type}`);
    }
  }
}

function SignUp() {
  const { signUp } = useAuth();
  const [state, dispatch] = useReducer(stateReducer, {
    status: "idle",
    data: {
      email: null,
      displayName: null,
      password: null,
    },
    error: null,
  });
  const [toggleVisibility, setToggleVisibility] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    displayName: "",
    password: "",
  });
  const buttonRef = useRef();
  const { status, data, error } = state;
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
          dispatch({ type: "idle" });
        } catch {
          dispatch({
            type: "rejected",
            error: new Error("Email is already in use by another account"),
          });
          setFormValues((prevState) => ({ ...prevState, email: "" }));
        }
      }
    }

    getSignUpData();
  }, [data]);

  function handleCheckbox(event) {
    setToggleVisibility(event.target.checked);
  }

  function handleChange(event) {
    const id = event.target.id;
    setFormValues((prevState) => ({
      ...prevState,
      [id]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    dispatch({ type: "resolved", data: formValues });
  }

  return (
    <div className={styles["sign-up-page"]}>
      <div>
        <h2>Site Logo</h2>
        <p>Sign up to see posts from other people!</p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={formValues.email}
          onChange={handleChange}
          id="email"
          type="email"
        />
        <input
          value={formValues.displayName}
          onChange={handleChange}
          id="displayName"
          type="text"
        />
        <div className="password-box">
          <input
            value={formValues.password}
            onChange={handleChange}
            id="password"
            type={toggleVisibility ? "text" : "password"}
          />

          <input type="checkbox" onChange={handleCheckbox} />
        </div>
        <button ref={buttonRef} type="submit">
          {status === "resolved" ? "Loading..." : "Sign up"}
        </button>
      </form>
      <div>{error && error.message}</div>
      <div>
        <p>Already have an account? Log im</p>
      </div>
    </div>
  );
}

export default SignUp;
