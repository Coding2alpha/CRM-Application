import { BrowserRouter, Routes, Route } from "react-router-dom";
import Campaign from "./pages/Campaign";
import CreateCampaign from "./pages/CreateCampaign";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Stats from "./pages/Stats";
import { useEffect } from "react";

const App = () => {

  useEffect(()=>{
    const fetchWelcome = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_APP_SERVER_DOMAIN
          }`
        );
        if (response.ok) {
          const data = await response.json();
          alert(data)
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchWelcome();
  },[])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/createCampaigns" element={<CreateCampaign />} />
        <Route path="/campaigns" element={<Campaign />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
