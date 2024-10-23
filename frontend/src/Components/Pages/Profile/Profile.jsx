import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const Profile = () => {
  const id = useParams().id;

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    gender: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/user/${id}`, {
          withCredentials: true,
        });

        // Filtering out unwanted fields
        const { username, email, phoneNumber, gender } = res.data;
        setUserData({ username, email, phoneNumber, gender });
      } catch (error) {
        console.log(error);
        toast.error("Error fetching user data");
      }
    };

    getUserData();
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8000/user/${id}/update`,
        userData,
        {
          withCredentials: true,
        }
      );
      setUserData(res.data.user);
      toast.success("User data updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error updating user data");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownSelect = (gender) => {
    setUserData({ ...userData, gender });
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex-col items-center h-full w-full p-6 bg-gray-50">
      <h1 className="text-5xl font-bold text-center mb-8">User Profile</h1>
      <hr className="w-full border-t-4 border-orange-300 mb-4" />
      <div className="bg-white shadow-lg rounded-lg p-6 transition-all duration-300 ease-in-out transform hover:scale-105">
        <div className="flex justify-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-orange-300 shadow-md"
          />
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xl">
            <h2 className="font-semibold">Username:</h2>
            <div className="flex items-center">
              <input
                type="text"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 transition-colors duration-300 focus:border-orange-500 focus:outline-none"
              />
              <FontAwesomeIcon icon={faPenToSquare} className="ml-2 text-orange-500" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xl">
            <h2 className="font-semibold">Email:</h2>
            <div className="flex items-center">
              <input
                type="text"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 transition-colors duration-300 focus:border-orange-500 focus:outline-none"
              />
              <FontAwesomeIcon icon={faPenToSquare} className="ml-2 text-orange-500" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xl">
            <h2 className="font-semibold">Phone:</h2>
            <div className="flex items-center">
              <input
                type="text"
                value={userData.phoneNumber}
                onChange={(e) =>
                  setUserData({ ...userData, phoneNumber: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 transition-colors duration-300 focus:border-orange-500 focus:outline-none"
              />
              <FontAwesomeIcon icon={faPenToSquare} className="ml-2 text-orange-500" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xl">
            <h2 className="font-semibold">Gender:</h2>
            <div className="relative flex items-center">
              <button className="border border-gray-300 rounded-md px-3 py-2 text-lg transition-colors duration-300 focus:border-orange-500 focus:outline-none">
                {userData.gender || "Select Gender"}
              </button>
              <FontAwesomeIcon
                icon={isDropdownOpen ? faAngleUp : faAngleDown}
                className="ml-2 cursor-pointer text-orange-500"
                onClick={toggleDropdown}
              />
              {isDropdownOpen && (
                <div className="absolute mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 transition-opacity duration-300 ease-in">
                  {["Male", "Female"].map((gender) => (
                    <button
                      key={gender}
                      className="block px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => handleDropdownSelect(gender)}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors duration-300"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
