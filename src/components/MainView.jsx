import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function MainView({ users }) {
  return (
    <>
      <div>
        {users &&
          users.map(el => {
            return (
              <div key={el.uid}>
                <Link to={el.uid}>{el.uid}</Link>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default MainView;

MainView.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
};
