import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useProfile from "../../../Zustand/useProfile";

const SaveContact = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contacts, setContacts] = useState([]);

  const { userId } = useProfile();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/user/${userId}/getContact`,
          { withCredentials: true }
        );
        setContacts(res.data.contact);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };

    getContacts();
  }, [userId]); // Ensure userId is included in the dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      toast.error("Invalid phone number");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8000/user/${userId}/saveContact`,
        { phoneNumber: phoneNumber },
        { withCredentials: true }
      );

      setPhoneNumber("");
      window.location.reload();
      // toast.success("Contact saved successfully");
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center bg-gray-100 p-5"
    style={{
      backgroundImage: "url('/background-pattern.png')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    }}>
      <h1 className="text-5xl  font-extrabold text-[#00ff55] shadow-lg text-center mb-8">Save Contact</h1>
      <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-5">
        <form className="flex w-full p-3 gap-3 text-lg" onSubmit={handleSubmit}>
          <input
            type="tele"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-grow border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Save
          </button>
        </form>
      </div>
      <div className="w-full max-w-md mx-auto mt-8 bg-white shadow-lg rounded-lg p-5">
        <h2 className="text-xl font-semibold text-indigo-600 mb-4">Contacts List</h2>
        {contacts.map((contact, index) => {
          const createdAtDate = new Date(contact.createdAt);
          const formattedDate = createdAtDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const formattedTime = createdAtDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div className="flex w-full p-3 gap-3 text-lg border-b border-gray-300" key={contact._id}>
              <h1 className="text-gray-700">{index + 1}</h1>
              <h1 className="text-gray-700">{contact.username}</h1>
              <h1 className="text-gray-700">{contact.phoneNumber}</h1>
              <h1 className="text-gray-500">{`${formattedDate} at ${formattedTime}`}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SaveContact;
