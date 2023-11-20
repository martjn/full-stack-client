import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./helpers/AuthContext";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";

import { Button, Navbar } from "@material-tailwind/react";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Token from "./pages/Token";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";

import MenuIcon from "@mui/icons-material/Menu";
import { ProfileMenu } from "./Components/UserProfile/ProfileMenu";

import "./index.css";
function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });
  const [profileMenuToggle, setProfileMenuToggle] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1280);


  useEffect(() => {
    axios
      .get("https://full-stack-api-pmvb.onrender.com/auth/auth", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);
  const onMenuToggle = () => {
    setProfileMenuToggle(!profileMenuToggle);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1280);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Navbar className="flex gap-10 max-w-full justify-around sticky border-0 border-b border-blue-gray-100 border-opacity-50 rounded-none top-0 mb-10 bg-black">
            {authState.status ? (
              <>
                {window.innerWidth <= 1280 ? (
                  <Button onClick={toggleSidebar} size="sm">
                    <MenuIcon className="text-white" />
                  </Button>
                ) : (
                  <Link to="/"
                    className="mb-2 flex items-center gap-4 cursor-pointer"
                  >
                    
                    <img src="https://postit-crud.vercel.app/favicon.ico" alt="brand" className="h-8 w-8" loading="lazy"/>
                    <span
                      className="font-black text-md text-white"
                    >
                      PostIt
                    </span>
                  </Link>
                )}
                <div
                  onClick={onMenuToggle}
                  className="flex cursor-pointer align-middle justify-center text-white font-bold items-center gap-5"
                >
                  <ProfileMenu toggleState={profileMenuToggle} userName={authState.username} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="mb-2 flex items-center gap-4 p-4 cursor-pointer">
                    <img src="https://postit-crud.vercel.app/favicon.ico" alt="brand" loading="lazy" className="h-10 w-10" />
                    <span className="font-black text-2xl text-white">
                      PostIt
                    </span>
                  </div>
                </div>
                <div className="flex gap-10 float-right align-middle justify-center items-center">
                  <Link className="items-center" to="/auth">
                    <Button size="sm">Sign In</Button>
                  </Link>
                  <Link className="" to="/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </div>
              </>
            )}
          </Navbar>
          {authState.status && (
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/token" element={<Token />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
