import { BrowserRouter, Routes, Route } from "react-router-dom";
import Campaign from "./pages/Campaign";
import CreateCampaign from "./pages/CreateCampaign";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Stats from "./pages/Stats";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import loader from './assets/loading.gif'

const App = () => {
  const uid = localStorage.getItem("uid");
  const [serverOn,setServerOn]=useState(false)

  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_SERVER_DOMAIN}`
        );
        if (response.ok) {
          const data = await response.json();
          toast(data.msg);
          setServerOn(true)
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchWelcome();
  }, []);

  if(!serverOn)
    {
      return (
        <div className="flex-col bg-slate-200 h-screen w-full flex justify-center items-center">
          <div className="p-4 text-blue-500 font-bold text-5xl">
            Please Wait...
          </div>
          <div className="h-20 w-20">
            <img src={loader}></img>
          </div>
        </div>
      );
    }

  return (
    <BrowserRouter>
      <Header />
      <Toaster />
      <div className="pt-16 min-h-[calc(100vh)] h-full bg-slate-300 relative">
        <Routes>
          <Route path="" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/createCampaigns" element={<CreateCampaign />} />
          <Route path="/campaigns" element={<Campaign />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
export default App;
