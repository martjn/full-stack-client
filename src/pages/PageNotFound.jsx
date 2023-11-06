import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <>
      <h1 className="text-7xl text-center">Page Error :(</h1>
      <h2 className="text-4xl text-center">
        Go to the{" "}
        <Link
          className="text-4xl justify-items-center text-center underline"
          to="/"
        >
          Home Page
        </Link>
      </h2>
    </>
  );
};

export default PageNotFound;
