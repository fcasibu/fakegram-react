import React from "react";

const Button = React.forwardRef((props, ref) => {
  return (
    <button ref={ref} {...props}>
      {props.children}
    </button>
  );
});

export default Button;
