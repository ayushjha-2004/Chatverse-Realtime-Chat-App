import React, { useEffect, useState } from "react";
import useProfile from "../../../../Zustand/useProfile";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";

const GetGroups = () => {
  const { userId } = useProfile();
  const [allGroups, setAllGroups] = useState([]);
  const [GroupHandle, setGroupHandle] = useState("");
  const [createGroupName, setCreateGroupName] = useState("");
  const [joinGroupHandle, setJoinGroupHandle] = useState("");

  useEffect(() => {
    const getGroups = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/group/${userId}/getGroups`,
          { withCredentials: true }
        );
        setAllGroups(res.data);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    getGroups();
  }, [userId]);

  // Handle create group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      if (!createGroupName.trim() || !GroupHandle.trim()) {
        toast.error("Group name cannot be empty");
        return;
      }
      if (GroupHandle.trim().includes("@") || GroupHandle.trim().includes(" ")) {
        toast.error("Group handle cannot contain @ or spaces");
        return;
      }
      const res = await axios.post(
        `http://localhost:8000/group/${userId}/createGroup`,
        {
          groupHandle: "@" + GroupHandle.trim(),
          groupName: createGroupName.trim(),
        },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setCreateGroupName("");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // Handle join group
  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      if (!joinGroupHandle.trim()) {
        toast.error("Group handle cannot be empty");
        return;
      }
      if (joinGroupHandle.trim().includes("@") || joinGroupHandle.trim().includes(" ")) {
        toast.error("Group handle cannot contain @ or spaces");
        return;
      }

      const res = await axios.post(
        `http://localhost:8000/group/${userId}/joinGroup`,
        {
          groupHandle: "@" + joinGroupHandle.trim(),
        },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      setJoinGroupHandle("");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // Handle leave group
  const handleLeaveGroup = async (groupHandle) => {
    try {
      // Log groupHandle for debugging
      console.log("Attempting to leave group with handle:", groupHandle);
  
      const res = await axios.post(
        `http://localhost:8000/group/${userId}/leaveGroup`,
        { groupHandle }, // Ensure groupHandle is sent in the request body
        { withCredentials: true }
      );
  
      toast.success(res.data.message);
  
      // Update the group list by removing the group that was left
      setAllGroups((prevGroups) => prevGroups.filter(group => group.groupHandle !== groupHandle));
      
    } catch (error) {
      // Log the error for debugging
      console.log("Error leaving group:", error);
  
      // Display the error message from the server
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-8"
    style={{
      backgroundImage: "url('/chat-pattern.png')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    }}>
      <div className="w-full flex justify-between items-start mb-10">
        <h1 className="text-4xl font-bold text-white bg-green-400 py-3 px-6 rounded-lg border border-gray-300 pa">All Groups</h1>

        <div className="flex flex-col space-y-4">
          {/* Create Group Form */}
          <form onSubmit={handleCreateGroup} className="flex space-x-2">
            <input
              type="text"
              className="w-full max-w-xs p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
              placeholder="Group Handle"
              value={GroupHandle}
              onChange={(e) => setGroupHandle(e.target.value)}
            />
            <input
              type="text"
              className="w-full max-w-xs p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
              placeholder="Group Name"
              value={createGroupName}
              onChange={(e) => setCreateGroupName(e.target.value)}
            />
            <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300">
              Create Group
            </button>
          </form>

          {/* Join Group Form */}
          <form onSubmit={handleJoinGroup} className="flex space-x-2">
            <input
              type="text"
              className="w-full max-w-xs p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
              placeholder="Group Handle"
              value={joinGroupHandle}
              onChange={(e) => setJoinGroupHandle(e.target.value)}
            />
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300">
              Join Group
            </button>
          </form>
        </div>
      </div>

      {/* Group List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allGroups.map((group) => (
          <div key={group._id} className="bg-green-300 shadow-lg rounded-2xl p-6 flex flex-col justify-between hover:shadow-2xl transition duration-300">
            <Link to={`/${userId}/groupchat/${group._id}`} className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {group.groupName}
              </h2>
              <p className="text-gray-600">@{group.groupHandle}</p>
            </Link>
            <button
              onClick={() => handleLeaveGroup(group.groupHandle)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Leave Group
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetGroups;
