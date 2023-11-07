import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./helpers/AuthContext";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";

import { Button, Navbar } from "@material-tailwind/react";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Token from "./pages/Token";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";

import HomeIcon from "../src/Components/Icons/HomeIcon";
import ProfileMenu from "./Components/UserProfile/ProfileMenu";

import "./index.css";
function App() {
  const [authState, setAuthState] = useState({username: "", id: 0, status: false});
  const [profileMenuToggle, setProfileMenuToggle] = useState(false);

  useEffect(() => {
    axios
      .get("https://full-stack-api-pmvb.onrender.com/auth/auth", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({...authState, status: false});
        } else {
          setAuthState({username: response.data.username, id: response.data.id, status: true});
        }
      });
  }, []);
  const onMenuToggle = () => {
    setProfileMenuToggle(!profileMenuToggle);
  };
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Navbar className="flex gap-10 max-w-full justify-around">
            {authState.status && (
              <Link to="/createpost">
                <Button size="sm">Create A Post</Button>
              </Link>
            )}
            <Link to="/">
              <Button size="sm">
                <HomeIcon />
              </Button>
            </Link>
            {authState.status ? (
              <div
                onClick={onMenuToggle}
                className="flex cursor-pointer align-middle justify-center text-gray-900 font-bold items-center gap-5"
              >
                <ProfileMenu
                  toggleState={profileMenuToggle}
                />
                {authState.username}
              </div>
            ) : (
              <div className="flex gap-10 float-right">
                <Link className="items-center" to="/auth">
                  <Button size="sm">Sign In</Button>
                </Link>
                <Link className="" to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </Navbar>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/createpost"
              element={<CreatePost />}
            />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/token" element={<Token />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="*" element={<PageNotFound/>}/>
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
