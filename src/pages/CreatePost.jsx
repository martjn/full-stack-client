import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@material-tailwind/react";
import "../index.css";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../helpers/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function CreatePost() {
  let navigate = useNavigate();
  let { authState } = useContext(AuthContext);

  const initialValues = {
    title: "",
    postText: "",
    username: authState.status ? authState.username : "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    postText: Yup.string().max(4000).required(),
  });

  const onSubmit = (data) => {
    axios
      .post("https://full-stack-api-pmvb.onrender.com/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        navigate("/");
      });
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/auth");
    }
  }, []);

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
          <div className="text-lg my-2 font-bold text-white rounded">
            Create a post
          </div>
          <div className="text-gray-400 mb-2 text-sm whitespace-pre-line">
            <div className="p-2">
              <Formik
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
              >
                <Form className="flex flex-col gap-6 mt-2">
                  <Field
                    type="text" // Change the type to text
                    className="rounded-md bg-black text-white"
                    name="title" // Use a different name for the title field
                    placeholder="Title..."
                    autoComplete="off"
                  />
                  <ErrorMessage
                    className="text-red-400 font-bold"
                    name="postText"
                    component="span"
                  />
                  <Field
                    component="textarea"
                    className="rounded-md bg-black text-white"
                    name="postText"
                    placeholder="Post content..."
                    autoComplete="off"
                  />
                  <Button className="my-5" type="submit">
                    Submit post
                  </Button>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreatePost;
