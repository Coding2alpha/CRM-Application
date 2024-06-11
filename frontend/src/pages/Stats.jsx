// src/Campaigns.js
import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { Bar } from "react-chartjs-2";
import { logOut } from "../firebase/firebase";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const userId = localStorage.getItem("uid");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_APP_SERVER_DOMAIN
          }/api/campaigns/stats/:${userId}`
        );
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCampaigns();
  }, []);

  const data = {
    labels: campaigns.map((campaign, index) => `Campaign ${index + 1}`),
    datasets: [
      {
        label: "Total Customers",
        data: campaigns.map((campaign) => campaign.totalCustomers),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Sent",
        data: campaigns.map((campaign) => campaign.sentCount),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Failed",
        data: campaigns.map((campaign) => campaign.failedCount),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Campaign Delivery Statistics",
      },
    },
  };

  return (
    <div className=" flex flex-col items-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl mt-6">
        <h2 className="text-2xl font-bold mb-4">Campaigns</h2>
        <Bar data={data} options={options} />
      </div>
      {/* <button
        className="bg-green-500 text-white px-4 py-2 mr-1 absolute top-4 right-4 z-10"
        onClick={logOut}
      >
        Logout
      </button> */}
    </div>
  );
};

export default Campaigns;
