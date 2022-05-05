import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAccount from "../hooks/useAccount";
import useForm from "../hooks/useForm";
import { updateProfile } from "firebase/auth";

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
  }, [validation]);

  async function getSignUpData() {
    if (status === "resolved") {
      buttonRef.current.disabled = true;
      try {
        await signUp(data).then(async ({ user }) => {
          await updateProfile(user, {
            photoURL: DEFAULT_AVATAR
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
    <Container className={styles.container}>
      <FormPage className={styles["form-page"]}>
        <Box>
          <h2>Site Logo</h2>
          <p>Sign up to see posts from other people!</p>
        </Box>
        <Form onSubmit={handleSubmit}>
          <InputForm
            value={email}
            onChange={handleChange}
            id="email"
            type="email"
            placeholder="Email Address"
          />
          <InputForm
            value={displayName}
            onChange={handleChange}
            id="displayName"
            type="text"
            placeholder="Display Name"
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
              <Label htmlFor="sign-up-checkbox">
                {password.length ? (visibility ? "Hide" : "Show") : null}
              </Label>
              <InputForm
                id="sign-up-checkbox"
                type="checkbox"
                onChange={handleCheckbox}
              />
            </Box>
          </Box>
          <Button ref={buttonRef} type="submit">
            {status === "resolved" ? "Loading..." : "Sign up"}
          </Button>
        </Form>
        <Box className={styles.error} role="alert">
          {error && error}
        </Box>
        <Box>
          <p>
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </Box>
      </FormPage>
    </Container>
  );
}

export default SignUp;
