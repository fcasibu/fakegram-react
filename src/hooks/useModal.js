import { useContext } from "react";
import ModalContext from "../context/ModalContext";

function useModal() {
  return useContext(ModalContext);
}

export default useModal;
