import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../firebase/firebase";
import toast from "react-hot-toast";

const CreateCampaign = () => {
  const [criteria, setCriteria] = useState({
    totalSpends: "",
    totalSpendsCondition: "greaterThan",
    visits: "",
    visitsCondition: "equalTo",
    visitStatus: "visitedInLastMonth",
    months: "", // New state for the number of months
    logic: "AND",
    customLogic: "",
    message: "",
  });
  const [audienceSize, setAudienceSize] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("uid");
  // console.log(userId);

  const handleSubmit = async () => {
    try {
      let count = 0;
      if (criteria.totalSpends) {
        count++;
      }
      if (criteria.visits) {
        count++;
      }
      if (criteria.months) {
        count++;
      }
      console.log(count);
      if (criteria.logic == "CUSTOM" && (count < 2 || !criteria.customLogic)) {
        if (count < 2) toast("Please enter more than 2 field for Custom query");
        else
          toast(
            "Please write the custom query in form of 0 operator 1 operator 2"
          );
      } else if (count === 0) {
        toast("Please enter min 1 field");
      } else {
        const response = await fetch(
          `${import.meta.env.VITE_APP_SERVER_DOMAIN}/api/campaigns/audience`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ criteria }),
          }
        );
        if (!response) {
          return <div>Please</div>;
        }
        if (response.ok) {
          const data = await response.json();
          setAudienceSize(data.count);
        } else {
          console.error("Error:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleSubmit1 = async () => {
    try {
      let check = true;
      if (criteria.customLogic) {
        let count = 0;
        if (criteria.totalSpends) {
          count++;
        }
        if (criteria.visits) {
          count++;
        }
        if (criteria.months) {
          count++;
        }
        if (count < 2) {
          // toast("Please enter more than 2 field for Custom query");
          check = false;
        }
        console.log(count);
      }
      if (criteria.message === "") {
        alert("Please enter the message");
      } else if (!check) {
        toast("Please enter more than 2 field for Custom query");
      } else {
        const response = await fetch(
          `${
            import.meta.env.VITE_APP_SERVER_DOMAIN
          }/api/campaigns/createCampaign/:${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ criteria, message: criteria.message }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          // console.log('success');
          navigate("/campaigns");
        } else {
          console.error("Error:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <button
        className="bg-green-500 text-white px-4 py-2 mr-1 absolute top-4 right-4 z-10"
        onClick={logOut}
      >
        Logout
      </button>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create Audience</h2>
        <div className="p-4 bg-slate-400 my-2">
          <div className="mb-4">
            <label className="block mb-2">(0). Total Spends</label>
            <select
              className="border p-2 w-full mb-2"
              value={criteria.totalSpendsCondition}
              onChange={(e) =>
                setCriteria({
                  ...criteria,
                  totalSpendsCondition: e.target.value,
                })
              }
            >
              <option value="greaterThan">Greater than</option>
              <option value="lessThan">Less than</option>
            </select>
            <input
              type="number"
              className="border p-2 w-full"
              value={criteria.totalSpends}
              onChange={(e) =>
                setCriteria({ ...criteria, totalSpends: e.target.value })
              }
              placeholder="total spends in rupees"
            />
          </div>
        </div>
        <div className="p-4 bg-slate-400 my-2">
          <div className="mb-4 ">
            <label className="block mb-2">(1). No. Of Visits</label>
            <select
              className="border p-2 w-full mb-2"
              value={criteria.visitsCondition}
              onChange={(e) =>
                setCriteria({ ...criteria, visitsCondition: e.target.value })
              }
            >
              <option value="greaterThan">Greater than</option>
              <option value="lessThan">Less than</option>
              <option value="equalTo">Equal to</option>
            </select>
            <input
              type="number"
              className="border p-2 w-full"
              value={criteria.visits}
              onChange={(e) =>
                setCriteria({ ...criteria, visits: e.target.value })
              }
              placeholder="Number of visits"
            />
          </div>
        </div>
        <div className="p-4 bg-slate-400 my-2">
          <div className="mb-4">
            <label className="block mb-2">(2). Visit Status</label>
            <select
              className="border p-2 w-full"
              value={criteria.visitStatus}
              onChange={(e) =>
                setCriteria({ ...criteria, visitStatus: e.target.value })
              }
            >
              <option value="visitedInLastMonth">Visited in last month</option>
              <option value="notVisitedInLastMonths">
                Not visited in last months
              </option>
            </select>
            <input
              type="number"
              className="border p-2 w-full mt-2"
              value={criteria.months}
              onChange={(e) =>
                setCriteria({
                  ...criteria,
                  months: e.target.value,
                })
              }
              placeholder="Number of months"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Logic</label>
          <select
            className="border p-2 w-full"
            value={criteria.logic}
            onChange={(e) =>
              setCriteria({ ...criteria, logic: e.target.value })
            }
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
            <option value="CUSTOM">CUSTOM</option>
          </select>
        </div>
        {criteria.logic === "CUSTOM" && (
          <div className="p-4 bg-slate-400 my-2">
            <div className="mb-4">
              <label className="block mb-2">
                Custom Logic [e.g., 1 AND 2 OR 3] where first 2 field calculated
                first and than the result of this calculated with the 3rd field
              </label>
              <input
                type="text"
                className="border p-2 w-full"
                value={criteria.customLogic}
                onChange={(e) =>
                  setCriteria({ ...criteria, customLogic: e.target.value })
                }
              />
            </div>
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-2">Message to send</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={criteria.message}
            onChange={(e) =>
              setCriteria({ ...criteria, message: e.target.value })
            }
            placeholder="Message for Customer"
          />
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 mr-1"
          onClick={handleSubmit}
        >
          Check Audience Size
        </button>
        {audienceSize !== null && (
          <div className="mt-4">
            <strong>Audience Size: </strong>
            {audienceSize}
          </div>
        )}
        <button
          className="bg-green-500 text-white px-4 py-2 ml-2"
          onClick={handleSubmit1}
        >
          Store Campaign
        </button>
        <Link to={"/campaigns"}>
          <div className="bg-blue-500 text-white px-4 py-2 mt-2">
            Show All Campaign
          </div>
        </Link>
        <Link to={"/stats"}>
          <div className="bg-blue-500 text-white px-4 py-2 mt-2">
            Show Campaign Stats
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CreateCampaign;
