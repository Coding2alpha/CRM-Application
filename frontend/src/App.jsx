import { BrowserRouter, Routes, Route } from "react-router-dom";
import Campaign from "./pages/Campaign";
import CreateCampaign from "./pages/CreateCampaign";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Stats from "./pages/Stats";

const App = () => {
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
