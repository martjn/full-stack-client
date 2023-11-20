import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Button } from "@material-tailwind/react";
import { AuthContext } from "../helpers/AuthContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import TimeAgo from "../Components/TimeAgo/TimeAgo";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Formik, Form, Field, ErrorMessage } from "formik";

function Post({ user }) {
  const [postData, setPostData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  let { id } = useParams();
  let { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  const initialValues = {
    commentText: "",
  };

  const onSubmit = (data, { resetForm }) => {
    const submitObject = {
      ...data,
      username: user || "anonymous",
      PostId: id,
    };
    axios
      .post("https://full-stack-api-pmvb.onrender.com/comments", submitObject, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          setCommentData([...commentData, submitObject]);
          resetForm();
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`https://full-stack-api-pmvb.onrender.com/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setCommentData(
          commentData.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  useEffect(() => {
    axios
      .get(`https://full-stack-api-pmvb.onrender.com/posts/${id}`)
      .then((response) => {
        setPostData(response.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://full-stack-api-pmvb.onrender.com/comments/${id}`)
      .then((response) => {
        setCommentData(response.data);
        console.log("Fetch comments");
      });
  }, []);

  const deletePost = (id) => {
    axios
      .delete(`https://full-stack-api-pmvb.onrender.com/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Edit title:");
      if (newTitle === "" || newTitle === null) return;
      axios.put(
        "https://full-stack-api-pmvb.onrender.com/posts/title",
        { newTitle: newTitle, id: id },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
      setPostData({ ...postData, title: newTitle });
    } else {
      let newPostBody = prompt("Edit body:");
      if (newPostBody === "" || newPostBody === null) return;
      axios.put(
        "https://full-stack-api-pmvb.onrender.com/posts/postText",
        { newText: newPostBody, id: id },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
      setPostData({ ...postData, postText: newPostBody });
    }
  };

  const goBack = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="flex flex-col items-center w-full rounded-sm border-blue-gray-100 border-opacity-50 md:w-3/4 lg:w-1/2 xl:w-1/2 mx-auto">
        <Button
          onClick={goBack}
          className="flex my-5 p-2 self-start items-center"
        >
          <ArrowBackIcon />
          Go Back
        </Button>
        <div className="p-4 w-full bg-black border-b border-t border-x border-opacity-50 border-blue-gray-100">
          <div className="flex flex-row justify-between">
            <div className="flex text-sm text-gray-400 gap-1">
              {`@${postData.username} · `}
              {postData.createdAt && <TimeAgo date={postData.createdAt} />}
            </div>
            {authState.username === postData.username && (
              <button
                onClick={() => {
                  deletePost(postData.id);
                }}
                className="text-red-900 rounded-lg hover:text-white transition"
              >
                <DeleteOutlineIcon />
              </button>
            )}
          </div>
          <div
            onClick={() => {
              if (authState.username === postData.username) {
                editPost("title");
              }
            }}
            className="text-lg my-2 font-bold text-white rounded"
          >
            {postData.title}
          </div>
          <div
            onClick={() => {
              editPost("body");
            }}
            className="text-gray-400 mb-2 text-sm whitespace-pre-line"
          >
            {postData.postText}
          </div>
          <hr></hr>
          {localStorage.getItem("accessToken") && (
            <div className="p-2">
              <Formik initialValues={initialValues} onSubmit={onSubmit}>
                <Form className="flex flex-col gap-6 mt-2">
                  <Field
                    component="textarea"
                    className="rounded-md bg-black text-white"
                    name="commentText"
                    placeholder="add a comment..."
                    autoComplete="off"
                  />
                  <Button className="my-5" type="submit">
                    Add Comment
                  </Button>
                </Form>
              </Formik>
            </div>
          )}
          <div className="p-4 shadow-lg rounded-xl">
            <span className="text-2xl text-white">
              Discussion ({commentData.length})
            </span>
            {commentData.map((comment, idx) => {
              return (
                <div
                  key={idx}
                  className="p-2 shadow-sm text-white border-b border-blue-gray-100 border-opacity-50"
                >
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row text-sm text-gray-400 justify-between w-full">
                      <div className="flex flex-row gap-1">
                        {`@${comment.username} · `}
                        {comment.createdAt && (
                          <TimeAgo date={comment.createdAt} />
                        )}
                      </div>
                      {authState.username === comment.username && (
                        <button
                          onClick={() => {
                            deleteComment(comment.id);
                          }}
                          className="text-red-900  hover:text-white transition"
                        >
                          <DeleteOutlineIcon />
                        </button>
                      )}
                    </div>
                  </div>
                  <p
                    style={{ whiteSpace: "pre-line" }}
                  >{`${comment.commentText}`}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
