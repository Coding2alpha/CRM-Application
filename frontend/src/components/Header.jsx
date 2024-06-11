import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logOut } from "../firebase/firebase";

const Header = () => {
  const uid = localStorage.getItem("uid");
  // console.log(uid);

  return (
    <div className="fixed flex h-16 pt-2 shadow-md w-full justify-center items-center px-1 md:px-4 z-10 bg-white">
      <Link to={"/home"}>
        <div className=" text-2xl">Welcome to CRM-Application</div>
      </Link>
    </div>
  );
};
export default Header;
