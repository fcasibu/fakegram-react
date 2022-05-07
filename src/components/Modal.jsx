import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import useModal from "../hooks/useModal";
import styles from "../styles/Modal.module.css";

function Backdrop({ close }) {
  return <div onClick={close} className={styles.backdrop}></div>;
}

function Modal({ component: Component }) {
  const { closeModal } = useModal();
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop close={closeModal} />,
        document.getElementById("backdrop")
      )}
      {ReactDOM.createPortal(<Component />, document.getElementById("modal"))}
    </>
  );
}

export default Modal;

Backdrop.propTypes = {
  close: PropTypes.func
};

Modal.propTypes = {
  component: PropTypes.elementType
};
