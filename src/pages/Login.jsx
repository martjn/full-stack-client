import React, {useState, useContext} from "react";
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
import { AuthContext } from "../helpers/AuthContext";
function Login() {
  let navigate = useNavigate();
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const {setAuthState} = useContext(AuthContext);
  const {authState} = useContext(AuthContext);

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(20).required(),
    password: Yup.string().min(3).max(20).required(),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (response.data.token) {
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("user", response.data.username);
        setAuthState({username: response.data.username, id: response.data.id, status: true})
        console.log(authState)
        navigate("/");
      }
      else{
        setWrongCredentials(true)
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
                Sign In
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <ErrorMessage
                className="text-red-400"
                name="username"
                component="span"
              />
              {wrongCredentials && <p className="text-red-500 font-bold">Wrong Username or Password</p>}
              <Field
                className="rounded-xl shadow-2xl"
                name="username"
                placeholder="Username"
                autoComplete="off"
              />
              <ErrorMessage
                className="text-red-400"
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
                Sign In
              </Button>
              <Typography variant="small" className="mt-6 flex justify-center">
                Don't have an account?
                <Typography
                  as="a"
                  href="#signup"
                  variant="small"
                  color="blue-gray"
                  className="ml-1 font-bold"
                >
                  <Link to="/register">Sign Up</Link>
                </Typography>
              </Typography>
            </CardFooter>
          </Card>
        </Form>
      </Formik>
    </div>
  );
}

export default Login;
