import React from "react";

function Box(props) {
  return <div {...props}>{props.children}</div>;
}

export default Box;
