import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ProfileMenu({ uid, signOut, setIsClicked }) {
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/signin");
  }
  return (
    <div className="profile-menu">
      <div>
        <Link to={`/${uid}`}>Profile</Link>
      </div>
      <div onClick={() => setIsClicked(false)}>
        <p>Close</p>
      </div>
      <div onClick={handleSignOut}>
        <p>Logout</p>
      </div>
    </div>
  );
}

export default ProfileMenu;

ProfileMenu.propTypes = {
  uid: PropTypes.string,
  signOut: PropTypes.func,
  setIsClicked: PropTypes.func
};
