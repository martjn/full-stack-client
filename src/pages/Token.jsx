import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Token() {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => setCount(count - 1), 1000);

    if (count === 0) {
      navigate("/auth");
    }
    return () => clearInterval(interval);
  }, [count]);

  return (
    <>
      <div className="text-3xl text-center">User registered successfully</div>
      <div className="flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="green"
          className="w-96 h-96"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      ;
      <div className="text-3xl text-center">
        Redirecting in {count} seconds...
      </div>
    </>
  );
}

export default Token;
