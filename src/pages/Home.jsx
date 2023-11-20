import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AuthContext } from "../helpers/AuthContext";
import CommentIcon from "@mui/icons-material/Comment";
import TimeAgo from "../Components/TimeAgo/TimeAgo";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { HeartIcon } from "@heroicons/react/24/solid";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const { authState } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1280);
  const [sortBy, setSortBy] = useState("date");
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/auth");
    } else {
      axios
        .get("https://full-stack-api-pmvb.onrender.com/posts", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
          params: {
            sortBy: sortBy,
          },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          console.log("response => ", response);
          setLikedPosts(
            response.data.likedPosts.map((value) => {
              return value.PostId;
            })
          );
          // Fetch comments only if listOfPosts is available
          if (response.data.listOfPosts.length !== 0) {
            const promises = response.data.listOfPosts.map((post) => {
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
    }
  }, [sortBy]);

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
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                // we only care about the length of the array here
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
        if (likedPosts.includes(postId)) {
          //remove
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          //add to liked posts array
          setLikedPosts([...likedPosts, postId]);
        }
      });
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

  const handleSort = (value) => {
    setSortBy(value);
    console.log("sort by", value);
  };

  return (
    <div class="flex flex-col">
      <div class="flex flex-col items-center my-4">
        <span class="text-white font-bold text-2xl cursor-default">
          Welcome to PostIt, {authState.username}
        </span>
      </div>
      <div className="flex flex-col my-2 items-center justify-center">
        <span className="text-white font-bold cursor-default">Sort by</span>
        <div className="flex">
          <button
            onClick={() => handleSort("date")}
            className={`${
              sortBy === "date" ? "bg-white text-black" : "bg-black text-white"
            } mx-2 rounded-md border tranisiton transition-all`}
          >
            <AccessTimeIcon />
          </button>
          <button
            onClick={() => handleSort("popularity")}
            className={`${
              sortBy === "popularity"
                ? "bg-white text-black"
                : "bg-black text-white"
            } mx-2 rounded-md tranisiton transition-all`}
          >
            <FavoriteIcon />
          </button>
          
        </div>
        <span className="text-white cursor-default">{sortBy}</span>
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
}

export default Home;
