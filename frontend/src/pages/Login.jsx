import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  signInWithGoogle,
  logInWithEmailAndPassword,
} from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Login() {
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
const uid = localStorage.getItem("uid");
  useEffect(() => {
    if (loading) return;
    if (uid) navigate("/createCampaigns");
  }, [user, loading]);

  return (
    <div className="flex h-[calc(100vh-80px)] w-screen justify-center items-center">
      <div className="flex flex-col space-y-3 bg-white p-10 rounded">
        <input
          type="text"
          className="outline-none bg-[white] text-black p-3 rounded border-2 border-gray-700 font-semibold"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="outline-none bg-[white] text-black p-3 rounded border-2 border-gray-700 font-semibold"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="bg-orange-400 font-bold px-5 py-2 rounded-full text-white"
          onClick={() => logInWithEmailAndPassword(email, password,navigate)}
        >
          Login
        </button>
        <button
          className="border-2 bg-white border-gray-700 font-semibold px-5 py-2 rounded-full flex space-x-2 items-center justify-center"
          onClick={()=>signInWithGoogle(navigate)}
        >
          <p>Login with</p>
          <img
            className="h-5 w-5"
            src="https://www.transparentpng.com/thumb/google-logo/google-logo-png-icon-free-download-SUF63j.png"
            alt=""
          />
        </button>
        <div className="flex flex-col items-center">
          {/* <div>
            <Link to="/reset" className="underline text-blue-500">
              Forgot Password
            </Link>
          </div> */}
          <div>
            Don't have an account?{" "}
            <Link to="/register" className="underline text-blue-500">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
