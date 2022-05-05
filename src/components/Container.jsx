import React from "react";

function Container(props) {
  return (
    <div style={{ maxWidth: "1024px", margin: "10rem auto" }} {...props}>
      {props.children}
    </div>
  );
}

export default Container;
