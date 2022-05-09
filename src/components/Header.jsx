import React from "react";
import { FiHome, FiSearch, FiHeart, FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Modal from "./Modal";
import useModal from "../hooks/useModal";
import UploadModal from "./UploadModal";

function Header() {
  const { currentUser } = useAuth();
  const { uid, photoURL, displayName } = currentUser;
  const { isModalOpen, openModal } = useModal();
  return (
    <header className="header">
      {isModalOpen && <Modal component={UploadModal} />}
      <div>
        <Link to="/" style={{ color: "var(--text-dark)" }}>
          <h2>Fakegram</h2>
        </Link>
      </div>
      <div className="search-bar">
        <div className="search-icon">
          <FiSearch />
        </div>
        <input />
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <FiHome />
            </Link>
          </li>
          <li>
            <FiMessageCircle />
          </li>
          <li>
            <button onClick={() => openModal()}>
              <p>+</p>
            </button>
          </li>
          <li>
            <FiHeart />
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
}

export default Header;
/*  <label htmlFor="upload-file">
              <p>+</p>
              <input id="upload-file" type="file" onChange={changeHandler} />
            </label>*/
