import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function SearchMenu({ users }) {
  return (
    <div className="menu">
      <div>
        {users.map((user, index) => {
          return (
            <Link to={`/${user.uid}`} key={index}>
              <p>{user.displayName}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SearchMenu;

SearchMenu.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
};
