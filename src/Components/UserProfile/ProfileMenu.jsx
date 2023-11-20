import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
} from "@material-tailwind/react";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from '@mui/icons-material/Logout';

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";

export function ProfileMenu() {
  const navigate = useNavigate();
  const { authState, setAuthState } = useContext(AuthContext);

  const onSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    navigate("/auth");
  };

  const onClickProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };
  return (
    <Menu>
      <MenuHandler>
        <Avatar
          variant="circular"
          alt="tania andrew"
          className="cursor-pointer"
          src="user.png"
          loading="lazy"
          style={{
            backgroundColor: "white",
            filter: "invert(1)",
            width: "2rem",
            height: "2rem",
          }}
        />
      </MenuHandler>
      <MenuList className="bg-black text-white border-blue-gray-100 border-opacity-50 mb-1">
        <div className="flex justify-center items-center flex-col cursor-default gap-1">
          <span className="font-bold">Logged in as</span>
          <span className="font-bold bg-blue-gray-900 py-1 px-5 rounded-full">
            {authState.username}
          </span>
        </div>
        <MenuItem
          className="flex items-center gap-2"
          onClick={() => {
            onClickProfile(authState.id);
          }}
        >
          <ManageAccountsIcon />

          <Typography variant="small" className="font-bold">
            My Profile
          </Typography>
        </MenuItem>

        <hr className="my-2 border-blue-gray-100 border-opacity-50" />
        <MenuItem className="flex items-center gap-2 " onClick={onSignOut}>
          <LogoutIcon/>
          <Typography color="red" variant="small" className="font-bold">
            Sign Out
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
