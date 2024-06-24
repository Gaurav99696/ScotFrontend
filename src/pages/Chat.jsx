import React, { useState, useEffect, useContext } from "react";
import Cookies from "universal-cookie";
import { json, useNavigate } from "react-router-dom";
import auth from "../context/AuthContext";
import { io } from "socket.io-client";
import Profile from "../components/Profile";
import Notify from "../components/Notify";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowRoundBack, IoMdSend, IoIosSearch } from "react-icons/io";
import { SiHoppscotch } from "react-icons/si";
import { GrAdd } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { LuMessagesSquare } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

const Chat = () => {
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const [chats, setChats] = useState([]);
  const [seeProfile, setSeeProfile] = useState(false);
  const [freands, setFreands] = useState([]);
  const [seeFreand, setSeeFreand] = useState(false);
  const [deletingFreand, setDeletingFreand] = useState(false);

  const cookies = new Cookies();
  const navigate = useNavigate();
  const AuthContext = useContext(auth);

  const userData = cookies.get("Scot_Auth-User_Data");

  const socket = io("http://localhost:5001", {
    path: "/chat",
  });

  useEffect(() => {
    const authToken = cookies.get("Scot_Auth-Token");
    if (!authToken) {
      console.log("No auth token, redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchFreands = async () => {
      const getFreands = await fetch(
        `https://scotbackend.onrender.com/api/users/getFreands/${userData._id}`
      );

      const response = await getFreands.json();

      setFreands(response.freands);
    };

    fetchFreands();
  }, []);

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
    if (deletingFreand) {
      const timer = setTimeout(() => {
        setDeletingFreand(false);
      }, 3000);
    }
  }, [AuthContext.logIn, AuthContext.register, deletingFreand]);

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

      await response.getUser.freand.map((freand) => {
        if (freand["userName"] === userData.userName) {
          return setChats(freand.messages);
        }
      });

      const chatSection = document.querySelector(".chatTextSection");
      chatSection.scrollBy(0, chatSection.scrollHeight);
    } catch (error) {
      console.error("Error fetching single user:", error);
    }
  };

  const backBtn = () => {
    console.log(chats);

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

  const deleteFreand = async () => {
    const freandUserName = currentUser.userName;
    const id = { id: userData._id };

    try {
      const deleting = await fetch(
        `https://scotbackend.onrender.com/api/users/deleteFeand/${freandUserName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(id),
        }
      );

      const response = await deleting.json();

      if (response.message == "Success") {
        document.querySelector(".numbers").style.display = "block";
        document.querySelector(".chatSection").style.display = "none";

        const fetchFreands = async () => {
          const getFreands = await fetch(
            `https://scotbackend.onrender.com/api/users/getFreands/${userData._id}`
          );

          const response = await getFreands.json();

          setFreands(response.freands);
        };

        fetchFreands();

        setDeletingFreand(true);
      }
    } catch (error) {
      console.error("Error In Deleting Frean", error);
    }
  };

  return (
    <div className="chatContanior">
      {seeFreand ? (
        <div className="freands-details">
          <RxCross2 className="cross" onClick={(e) => setSeeFreand(false)} />
          <FaUserCircle className="userIcon" />
          <h4>{currentUser.userName}</h4>
          <h5>{currentUser.email}</h5>
          <div className="flex">
            <button
              className="oprationButtons delete-freand"
              onClick={(e) => setSeeFreand(false)}
            >
              <LuMessagesSquare />
            </button>
            <button className="oprationButtons delete-freand" id="deleteAcc">
              <MdDelete />
            </button>
          </div>
        </div>
      ) : null}
      {AuthContext.logIn ? (
        <Notify type={"correct"} text={"You are Loged in Succsesfuly "} />
      ) : null}
      {AuthContext.register ? (
        <Notify type={"correct"} text={"You are Registered Succsesfuly "} />
      ) : null}
      {deletingFreand ? (
        <Notify type={"danger"} text={"Freand Deleted 😒"} />
      ) : null}
      <div className="numbers">
        <div className="logo">
          <h2 className="logoText">
            <SiHoppscotch className="star" />
          </h2>
          <div className="navIcons">
            <div onClick={() => navigate("/addFreand")}>
              <IoIosSearch className="userIcon" />
            </div>
            <div onClick={() => setSeeProfile(!seeProfile)}>
              <FaUserCircle className="userIcon" />
            </div>
          </div>
          {seeProfile && userData ? (
            <Profile
              userName={userData.userName}
              email={userData.email}
              seeProfile={setSeeProfile}
            />
          ) : null}
        </div>
        <div className="freands">
          {freands.length > 0 ? (
            freands.map((friend, index) => (
              <div
                key={index}
                onClick={() => fetchSingleUser(friend.userName)}
                className="contactNumbes"
              >
                <FaUserCircle className="userIcon" />
                <p>{friend.userName}</p>
              </div>
            ))
          ) : (
            <button id="addUser" onClick={() => navigate("/addFreand")}>
              <GrAdd />
              Add a friend
            </button>
          )}
        </div>
      </div>
      <div className="chatSection">
        {currentUser ? (
          <>
            <div className="nav">
              <div className="flex">
                {window.innerWidth < 766 ? (
                  <IoIosArrowRoundBack className="backBtn" onClick={backBtn} />
                ) : null}
                <div className="end">
                  <FaUserCircle
                    className="userIcon"
                    onClick={(e) => setSeeFreand(!seeFreand)}
                  />
                  <p>{currentUser ? currentUser.userName : null}</p>
                </div>
              </div>

              <button
                className="oprationButtons delete-freand"
                id="deleteAcc"
                onClick={(e) => deleteFreand()}
              >
                <MdDelete />
              </button>
            </div>
            <section className="chatTextSection">
              <br />
              <br />
              {chats?.map((chat, index) => (
                <>
                  <br />

                  <div className="texts" key={index}>
                    <div className="userName">
                      {chat.sender || chat.reciver}
                    </div>
                    <div>{chat.content}</div>
                  </div>
                  <br />
                </>
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
          </>
        ) : (
          <div className="big-log-wraper">
            <div className="big-logo-containor">
              <SiHoppscotch id="big-logo" />
              <p>Scot!</p>
            </div>
            <br />
            <h4>
              Click on any of ur Freand to Chat! ( Chle aate hai faltu log
              batkhi karne )
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
