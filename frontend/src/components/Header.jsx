import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { logOut } from "../firebase/firebase";

const Header = () => {
  const uid = localStorage.getItem("uid");
  // console.log(uid);

  return (
    <div className="fixed flex  h-16 pt-2 shadow-md w-full justify-center items-center px-1 md:px-4 z-10 bg-white">
      <Link to={"/home"}>
        <div className=" text-2xl">Welcome to CRM-Application</div>
      </Link>
      {uid && (
        <button
          className="bg-green-500 text-white px-4 py-2 mr-1 absolute top-4 right-4 z-10"
          onClick={logOut}
        >
          Logout
        </button>
      )}
    </div>
  );
};
export default Header;
