import React, { useState, useEffect, useContext } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import auth from "../context/AuthContext";
import { io } from "socket.io-client";

const Chat = () => {
  const [text, setText] = useState("");
  const [gettingCookie, setGettingCookie] = useState("");
  const [allUsers, setAllUsers] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [chats, setChats] = useState([]);

  const cookie = new Cookies(null, "/");
  const navigate = useNavigate();
  const AuthContext = useContext(auth);

  const userName = cookie.get("Scot_Auth-User_Data");
  const userData = cookie.get("Scot_Auth-User_Data");

  const socket = io("https://scotbackend.onrender.com");

  useEffect(() => {
    setGettingCookie(cookie.get("Scot_Auth-Token"));

    const getAllContacts = async () => {
      try {
        const getContacts = await fetch(
          `https://scotbackend.onrender.com/api/users/getAllUsers/${userData.userName}`
        );
        const response = await getContacts.json();
        setAllUsers(response.getUsers);
        if(window.innerWidth > 766){
          fetchSingleUser(response.getUsers[0].userName);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getAllContacts();
  }, []);

  useEffect(() => {
    socket.on("reciveMSG", (data) => {
      setChats((prevChats) => [...prevChats, data]);
    });
  }, []);



  const fetchSingleUser = async (userName) => {
    if(window.innerWidth < 766){
      document.querySelector(".numbers").style.display = "none"
      document.querySelector(".chatSection").style.display = "flex"
    }

    const getSingleUser = await fetch(
      `https://scotbackend.onrender.com/api/users/getSingleUser/${userName}`
    );

    const response = await getSingleUser.json();
    setCurrentUser(response.getUser);
    setChats(response.getUser.messages);

    const chatSection = document.querySelector(".chatTextSection");
    chatSection.scrollBy(0, chatSection.scrollHeight);
  };

  const backBtn = () => {
    document.querySelector(".numbers").style.display = "block"
    document.querySelector(".chatSection").style.display = "none"
  }

  const addChat = async () => {
    if (text.trim() !== "") {
      setText("");
    }
    const chatSection = document.querySelector(".chatTextSection");
    chatSection.scrollBy(0, chatSection.scrollHeight);

    const data = {
      sender: userData.userName,
      reciver: currentUser.userName,
      content: text,
    };

    socket.emit("sendMSG", data);
  };

  if (gettingCookie) {
    return (
      <div className="chatContanior">
        <div className="numbers">
          <div className="logo">
            <h2 className="logoText">Scot!</h2>
          </div>
          {allUsers &&
            allUsers.map((user, i) => {
              return (
                <div
                  className="contactNumbes"
                  key={user._id}
                  onClick={(e) => fetchSingleUser(user.userName)}
                >
                  <p>{user.userName}' Group</p>
                </div>
              );
            })}
        </div>
        <div className="chatSection">
          <div className="nav">
            {window.innerWidth < 766 ? <button className="backBtn" onClick={backBtn}>&lt;</button> : null}
            <p>{currentUser ? currentUser.userName : null}</p>
          </div>
          <section className="chatTextSection">
            <br />
            {chats.map((chat, index) => (
              <>
                <br />
                <br />
                <div className="texts" key={index}>
                  {chat.sender ? (
                    <div className="userName">{chat.sender}</div>
                  ) : (
                    <div className="userName">{chat.reciver}</div>
                  )}
                  <div>{chat.content}</div>
                </div>
              </>
            ))}
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
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
                Send
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  } else {
    return navigate("/login");
  }
};

export default Chat;
