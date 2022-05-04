import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAccount from "../hooks/useAccount";
import useForm from "../hooks/useForm";

import Container from "../components/Container";
import FormPage from "../components/FormPage";
import Form from "../components/Form";
import InputForm from "../components/InputForm";
import Label from "../components/Label";
import Button from "../components/Button";
import Box from "../components/Box";
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

  useEffect(() => {
    if (status === "idle") return;

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
    <Container className={styles.container}>
      <FormPage>
        <Box>
          <h2>Site Logo</h2>
        </Box>
        <Form onSubmit={handleSubmit}>
          <InputForm
            value={email}
            onChange={handleChange}
            id="email"
            type="email"
            placeholder="Email Address"
          />
          <Box className={styles["password-box"]}>
            <InputForm
              value={password}
              onChange={handleChange}
              id="password"
              type={visibility ? "text" : "password"}
              placeholder="Password"
            />
            <Box className={styles.checkbox}>
              <Label htmlFor="sign-in-checkbox">
                {password.length ? (visibility ? "Hide" : "Show") : null}
              </Label>
              <InputForm
                id="sign-in-checkbox"
                type="checkbox"
                onChange={handleCheckbox}
              />
            </Box>
          </Box>
          <Button ref={buttonRef} type="submit">
            {status === "resolved" ? "Loading..." : "Sign in"}
          </Button>
        </Form>
        <Box className={styles.error} role="alert">
          {error && error}
        </Box>
        <Box>
          <p>
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </Box>
      </FormPage>
    </Container>
  );
}

export default SignIn;
