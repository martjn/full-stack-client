import React, { useContext } from "react";
import DefaultUserIcon from "../Icons/DefaultUserIcon";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthContext } from "../../helpers/AuthContext";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

const ProfileMenu = ({ toggleState }) => {
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext);

  const onSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    navigate("/auth");
  };

  const onClickProfile = (userId) => {
    navigate(`/profile/${userId}`)
  };

  return (
    <div>
      <DefaultUserIcon />
      {toggleState && (
        <ul
          role="menu"
          data-popover="profile-menu"
          data-popover-placement="bottom"
          className="absolute z-10 flex min-w-[180px] flex-col gap-2 overflow-auto rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none"
        >
          <button
            tabIndex="-1"
            role="menuitem"
            className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
            onClick={() => {onClickProfile(1)}}
          >
            <AccountBoxIcon />
            <p className="block font-sans text-sm font-normal leading-normal text-inherit antialiased">
              Profile
            </p>
          </button>
          <button
            tabIndex="-1"
            role="menuitem"
            className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
            onClick={onSignOut}
          >
            <ExitToAppIcon />
            <p className="block font-sans text-sm font-normal leading-normal text-inherit antialiased">
              Sign Out
            </p>
          </button>
        </ul>
      )}
    </div>
  );
};

export default ProfileMenu;
