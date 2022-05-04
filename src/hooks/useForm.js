import { useState, useRef } from "react";

function useForm(initialState = {}) {
  const [formValues, setFormValues] = useState(initialState);

  const [visibility, setVisibility] = useState(false);
  const buttonRef = useRef();

  function changeVisibility(bool) {
    setVisibility(bool);
  }

  function changeFormValues({ id, value }) {
    setFormValues((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }

  return {
    formValues,
    buttonRef,
    changeVisibility,
    visibility,
    changeFormValues,
  };
}

export default useForm;
