import React from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Modal from "./Modal";
import useModal from "../hooks/useModal";
import UploadModal from "./UploadModal";

const Header = React.memo(function Header() {
  const { currentUser } = useAuth();
  const { uid, photoURL, displayName } = currentUser;
  const { isModalOpen, openModal } = useModal();

  return (
    <header className="header">
      {isModalOpen && <Modal component={UploadModal} />}
      <div>
        <h2>Site Logo</h2>
      </div>
      <div>
        <input />
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <FaHome />
            </Link>
          </li>
          <li>
            <button onClick={() => openModal()}>
              <p>+</p>
            </button>
          </li>
          <li>
            <Link to={`/${uid}`}>
              <img src={photoURL} alt={displayName} />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
});

export default Header;
/*  <label htmlFor="upload-file">
              <p>+</p>
              <input id="upload-file" type="file" onChange={changeHandler} />
            </label>*/
