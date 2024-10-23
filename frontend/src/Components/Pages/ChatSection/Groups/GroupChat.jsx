import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import useProfile from "../../../../Zustand/useProfile";
import { useParams } from "react-router-dom";
import useSocket from "../../../../Zustand/useSocket";

const GroupChat = () => {
  const { userId } = useProfile();
  const { groupId } = useParams();
  const socket = useSocket((state) => state.socket);

  const [groupInfo, setGroupInfo] = useState({});
  const [message, setMessage] = useState("");
  const [onlineMembers, setOnlineMembers] = useState([]);
  const messagesEndRef = useRef(null); // Create a ref for scrolling

  useEffect(() => {
    const getGroupInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/group/${userId}/getGroupInfo/${groupId}`,
          { withCredentials: true }
        );
        setGroupInfo(res.data);
      } catch (error) {
        console.log(error.response);
        toast.error(error.response.data.message);
      }
    };

    const newUserJoinedGroup = (data) => {
      setOnlineMembers(data);
    };

    const newGroupMessage = (data) => {
      setGroupInfo((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            message: data.message,
            senderId: {
              _id: data.user._id,
              username: data.user.username,
              displayName: data.user.displayName,
              profilePicture: data.user.profilePicture,
              phoneNumber: data.user.phoneNumber,
            },
            createdAt: new Date(), // Add the time when the message is received
          },
        ],
      }));
    };

    socket.emit("new-user-joined-group", { groupId, senderId: userId });

    socket.on("total-user-joined-group", newUserJoinedGroup);
    socket.on("new-group-message", newGroupMessage);

    getGroupInfo();

    return () => {
      socket.off("new-user-joined-group", newUserJoinedGroup);
      socket.off("new-group-message", newGroupMessage);
    };
  }, [groupId, userId, socket]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [groupInfo.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8000/group/${userId}/sendGroupMessage/${groupId}`,
        { message },
        { withCredentials: true }
      );

      socket.emit("send-group-message", {
        groupId,
        senderId: userId,
        message,
      });

      setMessage("");
      // scrollToBottom(); // No need to call here; it's handled in useEffect
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-between bg-gray-100">
      {/* Group Info Header */}
      <div className="bg-white shadow-md p-5 rounded-lg mb-4">
        <h1 className="font-bold text-4xl text-indigo-600">{groupInfo.groupName}</h1>
        <div className="flex items-center mt-2">
          <h2 className="text-lg font-semibold">Members:</h2>
          <div className="flex flex-wrap ml-3">
            {groupInfo.members &&
              groupInfo.members.map((member) => (
                <div
                  key={member._id}
                  className={`p-2 rounded-full text-sm font-medium mx-2 ${
                    onlineMembers.includes(member._id)
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {member.username}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groupInfo.messages &&
          groupInfo.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-center ${
                msg.senderId._id === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-lg p-4 rounded-lg shadow-md ${
                  msg.senderId._id === userId
                    ? "bg-green-400 text-right"
                    : "bg-gray-300 text-left"
                }`}
              >
                <p className="font-semibold">{msg.senderId.username}</p>
                <p className="mt-1">{msg.message}</p>
                <p className="text-xs text-black mt-2">
                  {new Date(msg.createdAt).toLocaleString()} {/* Date and Time */}
                </p>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} /> {/* Empty div for scrolling */}
      </div>

      {/* Message Input */}
      <div className="w-full p-4 bg-white shadow-inner">
        <form onSubmit={handleSubmit} className="flex w-full space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition duration-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;
