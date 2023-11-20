import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix
} from "@material-tailwind/react";
import {
  UserCircleIcon,

  PowerIcon,
} from "@heroicons/react/24/solid";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Link, useNavigate } from "react-router-dom";

export function Sidebar({isOpen, onClose}) {
  const [open, setOpen] = React.useState(0);
  const navigate = useNavigate();

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const handleNavigate = (route) => {
    navigate(route);
  }

  const sidebarStyles = isOpen ? "translate-x-0" : "-translate-x-full"; // Toggle the sidebar

  return (
    <Card className={`fixed h-full w-[20rem] p-4 shadow-blue-gray-900/5 bg-black rounded-none text-white border border-blue-gray-100 border-opacity-50 transition-transform transform ${sidebarStyles}`} style={{top: "72px"}}>
      <div
        className="mb-2 flex items-center gap-4 p-4 cursor-pointer"
        onClick={() => {
          navigate("/");
          onClose();
        }}
      >
        <img src="favicon.ico" alt="brand" className="h-8 w-8" />
        <Typography variant="h1" color="white" className="font-black text-3xl">
          Menu
        </Typography>
      </div>
      <hr className="my-2 border-blue-gray-100 border-opacity-50" />
      <List>
        <ListItem className="text-white" onClick={() => {handleNavigate("/createpost")}}>
          <ListItemPrefix>
            <AddBoxIcon />
          </ListItemPrefix>
          <ListItemSuffix className="font-bold">
            New Post
          </ListItemSuffix>
        </ListItem>
      </List>
    </Card>
  );
}
