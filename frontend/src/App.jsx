import { BrowserRouter, Routes, Route } from "react-router-dom";
import Campaign from "./pages/Campaign";
import CreateCampaign from "./pages/CreateCampaign";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Stats from "./pages/Stats";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "./components/Header";

const App = () => {
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_SERVER_DOMAIN}`
        );
        if (response.ok) {
          const data = await response.json();
          toast(data.msg);
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchWelcome();
  }, [uid]);

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
