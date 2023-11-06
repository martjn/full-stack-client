import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@material-tailwind/react";
import "../index.css";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../helpers/AuthContext";

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
    postText: Yup.string().required(),
  });

  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/posts", data, {
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

  return (
    <div className="flex flex-col my-11 lg:w-6/12 shrink-0 mx-10 shadow-2xl shadow-blue-gray-500 rounded-3xl p-10">
      <p className="text-6xl font-bold">Create a post</p>
      <p className="text-9xl font-bold">---</p>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="flex flex-col gap-6">
          {!authState.status && (
            <>
              <ErrorMessage
                className="text-red-400"
                name="username"
                component="span"
              />
              <Field
                className="rounded-xl shadow-2xl"
                name="username"
                placeholder="username"
                autoComplete="off"
              />
            </>
          )}
          <ErrorMessage
            className="text-red-400"
            name="title"
            component="span"
          />
          <Field
            className="rounded-xl shadow-2xl"
            name="title"
            placeholder="title"
            autoComplete="off"
          />
          <ErrorMessage
            className="text-red-400"
            name="postText"
            component="span"
          />
          <Field
            component="textarea"
            className="rounded-xl shadow-2xl h-48"
            name="postText"
            placeholder="content"
            autoComplete="off"
          />
          <Button type="submit">Create Post</Button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
