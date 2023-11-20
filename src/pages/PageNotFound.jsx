import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <>
      <h1 className="text-7xl text-center text-white">Page Error :(</h1>
      <h2 className="text-4xl text-center text-white">
        Go to the{" "}
        <Link
          className="text-4xl justify-items-center text-center text-white underline"
          to="/"
        >
          Home Page
        </Link>
      </h2>
    </>
  );
};

export default PageNotFound;
