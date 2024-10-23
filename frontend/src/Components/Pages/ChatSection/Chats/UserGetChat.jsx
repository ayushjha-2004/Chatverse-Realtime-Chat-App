import axios from "axios";
import React, { useEffect, useState } from "react";
import useProfile from "../../../../Zustand/useProfile";
import { Link } from "react-router-dom";
import useSocket from "../../../../Zustand/useSocket";

const UserGetChat = () => {
  const { userId } = useProfile();
  const socket = useSocket((state) => state.socket);

  const [userChat, setUserChat] = useState({});
  const [blockedContact, setBlockedContact] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [existingUser, setExistingUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search input

  useEffect(() => {
    const getUserChat = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/user/${userId}/getContact`,
          { withCredentials: true }
        );

        const obj = res.data.contact.reduce((acc, user) => {
          acc[user._id] = user;
          return acc;
        }, {});

        setExistingUser((prev) => {
          const newSet = new Set(prev);
          res.data.contact.map((data) => newSet.add(data._id));
          return Array.from(newSet);
        });

        setUserChat(obj);
        setBlockedContact(res.data.blockedContact);
      } catch (error) {
        console.log(error);
      }
    };

    const getMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/user/${userId}/getmessages`,
          { withCredentials: true }
        );

        res.data.users.map((data) => {
          if (!userChat[data]) {
            setUserChat((prev) => ({
              ...prev,
              [data._id]: data,
            }));
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    const handleOnlineUsers = (users) => {
      const validatedUsers = users.filter((user) => user !== userId);
      setOnlineUsers(validatedUsers);
    };

    const handleSeenMessages = (data) => {
      if (
        data.user &&
        data.user._id &&
        data.user._id !== userId &&
        !userChat[data.user._id]
      ) {
        setUserChat((prev) => ({
          ...prev,
          [data.user._id]: data.user,
        }));
      }
    };

    socket.emit("connected-user", { senderId: userId });

    socket.on("new-messages", handleSeenMessages);
    socket.on("online-users", handleOnlineUsers);

    getUserChat();
    getMessages();

    return () => {
      socket.off("new-messages", handleSeenMessages);
      socket.off("online-users", handleOnlineUsers);
    };
  }, [socket, userId]);

  // Filter users based on search input
  const filteredUsers = Object.values(userChat).filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="w-full h-full flex flex-col gap-4 p-4 bg-gray-300 rounded-lg shadow-lg"
      style={{
        backgroundImage: "url('/background-pattern.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Stylish ChatVerse Header */}
      <Link to={`/`}>
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-5xl font-extrabold text-[#00ff55] shadow-lg">
            ChatVerse
          </h1>
        </div>
      </Link>

      {/* Search Section */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Users..."
          className="w-full p-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex justify-center items-center h-full animate-fade-in">
          <h1 className="text-4xl text-gray-600 font-bold">No Contacts Found</h1>
        </div>
      ) : (
        filteredUsers.map((user) => (
          <Link to={`/${userId}/chat/${user._id}`} key={user._id}>
            <div
              className={`w-full p-4 transition-all duration-300 ease-in-out transform hover:scale-102 
                ${
                  blockedContact.includes(user._id)
                    ? "bg-red-200 hover:bg-red-300"
                    : "bg-blue-100 hover:bg-blue-50"
                } 
                rounded-xl shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1
                    className={`text-xl font-bold ${
                      existingUser.includes(user._id) ? "" : "hidden"
                    }`}
                  >
                    {user.displayName}
                  </h1>
                  <p className="text-gray-500 text-sm">{user.phoneNumber}</p>
                  {onlineUsers.includes(user._id) && (
                    <p className="text-xs text-green-500 animate-pulse">Online</p>
                  )}
                </div>
                <div>
                  {onlineUsers.includes(user._id) ? (
                    <span className="block w-3 h-3 bg-green-400 rounded-full"></span>
                  ) : (
                    <span className="block w-3 h-3 bg-gray-400 rounded-full"></span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default UserGetChat;
