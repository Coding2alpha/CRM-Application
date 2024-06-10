// src/Campaigns.js
import React, { useEffect, useState } from "react";
import { logOut } from "../firebase/firebase";
import Stats from './Stats'

const Campaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const userId = localStorage.getItem("uid");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_APP_SERVER_DOMAIN
          }/api/campaigns/getAllCampaign/:${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setCampaigns(data);
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="relative">
      <Stats />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 ">
        <button
          className="bg-green-500 text-white px-4 py-2 mr-1 absolute top-4 left-4"
          onClick={logOut}
        >
          Logout
        </button>
        <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl mt-6">
          <h2 className="text-2xl font-bold mb-4">Campaigns</h2>
          <div className="space-y-4">
            {campaigns.map((campaign, index) => (
              <div key={index} className="border p-4 rounded">
                <p>
                  <strong>Audience Criteria:</strong>{" "}
                  {campaign.audienceCriteria}
                </p>
                <p>
                  <strong>Message:</strong> {campaign.message}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(campaign.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Customers:</strong>
                </p>
                <ul className="list-disc pl-5">
                  {campaign.customers.map((customer, idx) => (
                    <li key={idx}>
                      {customer.email} - {customer.status} (
                      {new Date(customer.deliveryDate).toLocaleString()})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
