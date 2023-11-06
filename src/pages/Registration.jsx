import React, {useState} from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";

function Registration() {
  let navigate = useNavigate();
  const [userExists, setUserExists] = useState(false);

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(3).max(15).required(),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data).then((response) => {
      if (response.data.status === "success") {
        setUserExists(false)
        navigate("/token")
      }
      else if (response.data.status === "user_already_exists"){
        setUserExists(true);
      }
    });
  };
  return (
    <div className="mt-10 flex flex-column justify-start align-middle flex-nowrap justify-center align-middle ">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="flex flex-col gap-6">
          <Card className="w-96">
            <CardHeader
              variant="gradient"
              color="gray"
              className="mb-4 grid h-28 place-items-center"
            >
              <Typography variant="h3" color="white">
                Create an account
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <ErrorMessage
                className="text-red-400 font-bold"
                name="username"
                component="span"
              />
              {userExists && <p className="text-red-500 font-bold">User already exists</p>}
              <Field
                className="rounded-xl shadow-2xl"
                name="username"
                placeholder="Username"
                autoComplete="off"
              />
              <ErrorMessage
                className="text-red-400 font-bold"
                name="password"
                component="span"
              />
              <Field
                className="rounded-xl shadow-2xl"
                name="password"
                placeholder="Password"
                autoComplete="off"
                type="password"
              />
            </CardBody>
            <CardFooter className="pt-0">
              <Button type="submit" variant="gradient" fullWidth>
                Sign Up
              </Button>
              <Typography variant="small" className="mt-6 flex justify-center">
                Already have an account?
                <Typography
                  as="a"
                  href="#signup"
                  variant="small"
                  color="blue-gray"
                  className="ml-1 font-bold"
                >
                  <Link to="/auth">Sign In</Link>
                </Typography>
              </Typography>
            </CardFooter>
          </Card>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
