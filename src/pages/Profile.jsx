import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import TimeAgo from "../Components/TimeAgo/TimeAgo";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@material-tailwind/react";

const Profile = () => {
  let { id } = useParams();
  const [userData, setUserData] = useState({
    username: "",
    postCount: 0,
    createdAt: null,
  });
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentData, setCommentData] = useState([]);
  let navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`https://full-stack-api-pmvb.onrender.com/auth/user/${id}`, {})
      .then((response) => {
        setUserData({
          username: response.data.username,
          postCount: response.data.associatedPosts.length,
          createdAt: response.data.createdAt,
        });
        setListOfPosts(response.data.associatedPosts);
        console.log("profile response.data => ", response.data);
        setLikedPosts(
          response.data.likedPosts.map((value) => {
            return value.PostId;
          })
        );
        if (response.data.associatedPosts.length !== 0) {
          const promises = response.data.associatedPosts.map((post) => {
            return axios
              .get(
                `https://full-stack-api-pmvb.onrender.com/comments/${post.id}`
              )
              .then((response) => {
                setCommentData((prevCommentData) => [
                  ...prevCommentData,
                  {
                    postId: post.id,
                    commentAmount: response.data.length,
                  },
                ]);
              });
          });
        }
      });
  }, []);

  const onLike = (postId) => {
    axios
      .post(
        "https://full-stack-api-pmvb.onrender.com/likes",
        { PostId: postId },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        setListOfPosts((prevListOfPosts) =>
          prevListOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        setLikedPosts((prevLikedPosts) => {
          if (prevLikedPosts.includes(postId)) {
            // Remove postId if it's in likedPosts
            return prevLikedPosts.filter((id) => id !== postId);
          } else {
            // Add postId if it's not in likedPosts
            return [...prevLikedPosts, postId];
          }
        });
      });
  };

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <Button
        onClick={goBack}
        className="flex my-5 p-2 self-center mx-auto items-center"
      >
        <ArrowBackIcon />
        Go Back
      </Button>
      <div className="flex flex-col items-center border-x border-t rounded-sm border-blue-gray-100 border-opacity-50 w-full md:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto">
        <div className="my-2 p-2 font-bold text-white border-b border-opacity-25 border-blue-gray-100">
          {userData.username}'s Profile
        </div>
        <div className="flex flex-col 2xl:flex-row justify-between gap-4 p-4 w-full border-b border-opacity-50 border-blue-gray-100">
          <div className="flex justify-center">
            <AccountCircleIcon
              style={{ fontSize: "200px", filter: "invert(1)", zIndex: -1 }}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between text-lg text-white gap-4 border-b border-opacity-25 border-blue-gray-100">
              <span className="font-black ">Username </span>
              <span className="font-regular">{userData.username}</span>
            </div>
            <div className="flex justify-between text-lg text-white gap-4 border-b border-opacity-25 border-blue-gray-100">
              <span className="font-black">Posts </span>
              <span className="font-regular">{userData.postCount}</span>
            </div>
            <div className="flex justify-between text-lg text-white gap-4 border-b border-opacity-25 border-blue-gray-100">
              <span className="font-black">Registered</span>
              <span className="font-regular">
                {userData.createdAt !== null &&
                  new Intl.DateTimeFormat("eu-EE", {
                    year: "numeric",
                    day: "numeric",
                    month: "numeric",
                    hour12: false,
                  }).format(new Date(userData.createdAt))}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center my-4">
        <span class="text-white font-bold text-2xl cursor-default">
          {userData.username}'s Post history
        </span>
      </div>
      <div className="flex flex-col items-center w-fit border-x border-t rounded-sm border-blue-gray-100 border-opacity-50 md:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto">
        {listOfPosts.map((value, key) => {
          return (
            <div
              key={key}
              className="p-4 w-full bg-black border-b border-opacity-50 border-blue-gray-100"
            >
              <div className="text-sm text-gray-400">
                {`@${value.username} · `}
                <TimeAgo date={value.createdAt} />
              </div>
              <div className="text-lg my-2 font-bold text-white rounded">
                {value.title}
              </div>
              <div className="text-gray-400 mb-2 text-sm whitespace-pre-line">
                {value.postText}
              </div>
              <div class="flex flex-row">
                <div class="flex flex-row text-white hover:text-orange-900 transition-all mr-3 bg-blue-gray-900 rounded-lg p-1">
                  {likedPosts.includes(value.id) ? (
                    <FavoriteIcon
                      className="cursor-pointer"
                      onClick={() => {
                        onLike(value.id);
                      }}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      className="cursor-pointer"
                      onClick={() => {
                        onLike(value.id);
                      }}
                    />
                  )}

                  <label className="ml-1 text-md font-bold rounded-lg">
                    {value.Likes.length}
                  </label>
                </div>

                <div class="flex flex-row text-white hover:text-orange-900 transition-all bg-blue-gray-900 rounded-lg p-1">
                  <CommentIcon
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/post/${value.id}`);
                    }}
                  />
                  <label className="ml-1 text-md font-bold rounded-lg">
                    {
                      commentData.find((comment) => comment.postId === value.id)
                        ?.commentAmount
                    }
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
