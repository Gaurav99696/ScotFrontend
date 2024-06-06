import React, { useState, useEffect, useContext } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import auth from "../context/AuthContext";
import { io } from "socket.io-client";
import Profile from "../components/Profile";
import Notify from "../components/Notify";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowRoundBack, IoMdSend } from "react-icons/io";
import { SiHoppscotch } from "react-icons/si";

const Chat = () => {
  const [text, setText] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [chats, setChats] = useState([]);
  const [seeProfile, setSeeProfile] = useState(false);

  const cookies = new Cookies();
  const navigate = useNavigate();
  const AuthContext = useContext(auth);

  const userData = cookies.get("Scot_Auth-User_Data");

  const socket = io("https://scotbackend.onrender.com", {
    path: "/chat",
  });

  useEffect(() => {
    const authToken = cookies.get("Scot_Auth-Token");
    if (!authToken) {
      console.log("No auth token, redirecting to login.");
      navigate("/login");
      return;
    }

    if (!userData) {
      console.log("No user data, redirecting to login.");
      navigate("/login");
      return;
    }

    const getAllContacts = async () => {
      try {
        const getContacts = await fetch(
          `https://scotbackend.onrender.com/api/users/getAllUsers/${userData.userName}`
        );
        const response = await getContacts.json();
        setAllUsers(response.getUsers);
        if (window.innerWidth > 766 && response.getUsers.length > 0) {
          fetchSingleUser(response.getUsers[0]?.userName);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getAllContacts();
  }, [navigate, userData]);

  useEffect(() => {
    socket.on("reciveMSG", (data) => {
      setChats((prevChats) => [...prevChats, data]);
    });
    return () => {
      socket.off("reciveMSG");
    };
  }, []);

  useEffect(() => {
    if (AuthContext.logIn) {
      const timer = setTimeout(() => {
        AuthContext.setLogIn(false);
      }, 3000);
    }
    if (AuthContext.register) {
      const timer = setTimeout(() => {
        AuthContext.setRegister(false);
      }, 3000);
    }
  }, [AuthContext.logIn, AuthContext.register]);

  const fetchSingleUser = async (userName) => {
    if (!userName) return;

    if (window.innerWidth < 766) {
      document.querySelector(".numbers").style.display = "none";
      document.querySelector(".chatSection").style.display = "flex";
    }

    try {
      const getSingleUser = await fetch(
        `https://scotbackend.onrender.com/api/users/getSingleUser/${userName}`
      );
      const response = await getSingleUser.json();
      setCurrentUser(response.getUser);
      setChats(response.getUser.messages);
      const chatSection = document.querySelector(".chatTextSection");
      chatSection.scrollBy(0, chatSection.scrollHeight);
    } catch (error) {
      console.error("Error fetching single user:", error);
    }
  };

  const backBtn = () => {
    document.querySelector(".numbers").style.display = "block";
    document.querySelector(".chatSection").style.display = "none";
  };

  const addChat = async () => {
    if (text.trim() === "") return;
    setText("");
    const chatSection = document.querySelector(".chatTextSection");
    chatSection.scrollBy(0, chatSection.scrollHeight);

    if (!userData || !currentUser) return;

    const data = {
      sender: userData.userName,
      reciver: currentUser.userName,
      content: text,
    };

    socket.emit("sendMSG", data);
  };

  return (
    <div className="chatContanior">
      {AuthContext.logIn ? (
        <Notify type={"correct"} text={"You are Loged in Succsesfuly "} />
      ) : null}
      {AuthContext.register ? (
        <Notify type={"correct"} text={"You are Registered Succsesfuly "} />
      ) : null}
      <div className="numbers">
        <div className="logo">
          <h2 className="logoText">
            <SiHoppscotch />
            Scot!
          </h2>
          <div onClick={() => setSeeProfile(!seeProfile)}>
            <FaUserCircle className="userIcon" />
          </div>
          {seeProfile && userData ? (
            <Profile userName={userData.userName} email={userData.email} />
          ) : null}
        </div>
        {allUsers.map((user) => (
          <div
            className="contactNumbes"
            key={user._id}
            onClick={() => fetchSingleUser(user.userName)}
          >
            <p>
              <FaUserCircle className="userIcon" />
              {user.userName}' Group
            </p>
          </div>
        ))}
      </div>
      <div className="chatSection">
        <div className="nav">
          {window.innerWidth < 766 ? (
            <IoIosArrowRoundBack className="backBtn" onClick={backBtn} />
          ) : null}
          <p>{currentUser ? currentUser.userName : null}</p>
        </div>
        <section className="chatTextSection">
          {chats.map((chat, index) => (
            <div className="texts" key={index}>
              <div className="userName">{chat.sender || chat.reciver}</div>
              <div>{chat.content}</div>
            </div>
          ))}
          <div className="sendText">
            <textarea
              type="text"
              rows={1}
              cols={15}
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type here..."
            />
            <button id="sendButton" onClick={addChat}>
              <IoMdSend />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Chat;
