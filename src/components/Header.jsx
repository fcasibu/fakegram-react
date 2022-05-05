import React from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Box from "./Box";
import InputForm from "./InputForm";

function Header() {
  const { currentUser } = useAuth();

  return (
    <header className="header">
      <Box>
        <h2>Site Logo</h2>
      </Box>
      <Box>
        <InputForm />
      </Box>
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
}

export default Header;
