import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  let { id } = useParams();
  const [userData, setUserData] = useState({ username: "", postCount: 0 });
  const [listOfPosts, setListOfPosts] = useState([]);
  let navigate = useNavigate();
  useEffect(() => {
    axios.get(`http://localhost:3001/auth/user/${id}`).then((response) => {
      setUserData({
        username: response.data.username,
        postCount: response.data.associatedPosts.length,
      });
      setListOfPosts(response.data.associatedPosts);
      console.log(response.data);
    });
  }, []);
  return (
    <div>
      <div className="p-4 w-1/2 shadow-lg my-5 rounded-xl">
        <div className="my-2 p-2 font-bold bg-gray-800 text-blue-gray-200 rounded">
          Your info
        </div>
        <div className="flex flex-row justify-between">
          <div className="w-auto">
            <AccountCircleIcon style={{ fontSize: "400px" }} />
          </div>
          <div className="w-96 border-2 border-violet-600 rounded p-2">
            <div className="flex justify-between text-2xl">
              <span className="font-black">Username </span>
              <span className="font-regular">{userData.username}</span>
            </div>
            <div className="flex justify-between text-2xl">
              <span className="font-black">Posts </span>
              <span className="font-regular">{userData.postCount}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 my-2 p-2 font-bold bg-gray-800 text-blue-gray-200 rounded">
        {userData.username}'s Post history
      </div>
      {listOfPosts.map((value, key) => {
        return (
          <div
            key={key}
            className="p-4 w-1/2 shadow-lg my-5 hover:shadow-2xl hover:border-opacity-100 hover:border-2 rounded-lg"
          >
            <div
              className="my-2 p-2 font-bold bg-gray-800 text-blue-gray-200 rounded cursor-pointer"
              onClick={() => {
                navigate(`/post/${value.id}`);
              }}
            >
              {value.title}
            </div>
            <div
              className="border-2 border-violet-600 rounded p-2"
              onClick={() => {
                navigate(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>
            <div class="flex flex-row justify-between mt-1">
              <div  className="p-1 font-bold bg-blue-gray-100 rounded-md">{`@${value.username}`}</div>

              <div className="p-1 font-bold bg-blue-gray-100 rounded-md">
                Likes: {value.Likes.length}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Profile;
