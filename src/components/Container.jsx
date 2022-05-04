import React from "react";

function Container(props) {
  return <div {...props}>{props.children}</div>;
}

export default Container;
