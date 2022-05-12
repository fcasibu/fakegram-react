import React, { useEffect, useState } from "react";
import { FiHome, FiSearch, FiHeart, FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import Modal from "./Modal";
import useModal from "../hooks/useModal";
import UploadModal from "./UploadModal";
import SearchMenu from "./SearchMenu";
import ProfileMenu from "./ProfileMenu";

function Header() {
  const { currentUser, signOut } = useAuth();
  const { uid, photoURL, displayName } = currentUser;
  const [isClicked, setIsClicked] = useState(false);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { isModalOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    const fetchData = async () => {
      const data = await db.collection("users").orderBy("createdAt").get();

      data.docs.forEach(doc => {
        setUsers(state => [...state, doc.data()]);
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(user => {
        return user.displayName.toLowerCase().includes(query.toLowerCase());
      })
    );
  }, [query]);

  return (
    <header className="header">
      {isModalOpen && (
        <Modal
          component={<UploadModal closeModal={closeModal} />}
          closeModal={closeModal}
        />
      )}
      <div>
        <Link to="/" style={{ color: "var(--text-dark)" }}>
          <h2>Fakegram</h2>
        </Link>
      </div>
      <div className="search-bar">
        <div className="search-icon">
          <FiSearch />
        </div>
        <input
          onBlur={() => {
            setTimeout(() => {
              setQuery("");
            }, 100);
          }}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {!query.length ? null : <SearchMenu users={filteredUsers} />}
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
            <img
              onClick={() => setIsClicked(true)}
              src={photoURL}
              alt={displayName}
            />
            {isClicked && (
              <ProfileMenu
                uid={uid}
                signOut={signOut}
                setIsClicked={setIsClicked}
              />
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
