import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
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
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((value) => {
              return value.PostId;
            })
          );
        });
    }
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

  return (
    <div className="flex flex-col items-center">
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
            <div className="text-sm">{`@${value.username}`}</div>
            <div>
              {likedPosts.includes(value.id) ? (
                <ThumbUpIcon
                  className="cursor-pointer"
                  onClick={() => {
                    onLike(value.id);
                  }}
                />
              ) : (
                <ThumbUpOutlinedIcon
                  className="cursor-pointer"
                  onClick={() => {
                    onLike(value.id);
                  }}
                />
              )}

              <label className="ml-2 p-2 text-md font-bold bg-blue-gray-100 rounded-lg">
                {value.Likes.length}
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
