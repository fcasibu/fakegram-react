import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import useAuth from "./hooks/useAuth";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import EditProfile from "./pages/EditProfile";
import Modal from "./components/Modal";
import PostModal from "./components/PostModal";
import DatabaseProvider from "./context/DatabaseProvider";
import SeeAll from "./pages/SeeAll";

function PrivateRoute() {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
}

function App() {
  return (
    <Router basename="/">
      <AuthProvider>
        <DatabaseProvider>
          <Routes>
            <Route exact path="/" element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path=":userID" element={<Profile />}>
                <Route
                  path="/:userID/:postId"
                  element={<Modal component={<PostModal />} />}
                />
              </Route>
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/see-all" element={<SeeAll />} />
            </Route>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </DatabaseProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
