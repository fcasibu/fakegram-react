import React from "react";

function Label(props) {
  return <label {...props}>{props.children}</label>;
}

export default Label;
