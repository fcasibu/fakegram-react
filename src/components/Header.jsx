import React from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Header = React.memo(function Header() {
  const { currentUser } = useAuth();

  return (
    <header className="header">
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
            <button type="button">+</button>
          </li>
          <li>
            <Link to={`/${currentUser.uid}`}>
              <img src={currentUser.photoURL} alt={currentUser.displayName} />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
});

export default Header;
