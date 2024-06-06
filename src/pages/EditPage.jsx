import { useContext, useEffect, useState } from "react";
import React from "react";
import Contanior from "../components/Contanior";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import auth from "../context/AuthContext";
import Notify from "../components/Notify";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";

const EditPage = () => {
  const navigate = useNavigate();
  const cookie = new Cookies(null, "/");

  const AuthContext = useContext(auth);

  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [response, setResponse] = useState(null);
  let [editError, setEditError] = useState("");
  let [userInfo, setUserInfo] = useState("");

  useEffect(() => {
    const userInfo = cookie.get("Scot_Auth-User_Data");
    if (userInfo) {
      setUserInfo(userInfo);
      const getUser = async () => {
        const response = await fetch(
          `https://scotbackend.onrender.com/api/users/getSingleUser/${userInfo.userName}`
        );
        const data = await response.json();
        setResponse(data);
        setUserName(data.getUser.userName);
        setEmail(data.getUser.email);
      };
      getUser();
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (editError) {
      const timer = setTimeout(() => {
        setEditError("");
      }, 5000);
    }

    if (AuthContext.editUser) {
      const timer = setTimeout(() => {
        AuthContext.setEditUser("");
      }, 3000);
    }
  }, [editError, AuthContext.editUser]);

  const editAcc = async () => {
    let data = {};
    const regexEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

    try {
      if (userName !== response.getUser.userName) {
        data.userName = userName;
      }

      if (email !== response.getUser.email) {
        if (regexEmail.test(email)) {
          data.email = email;
        } else {
          setEditError("Check Your email");
        }
      }

      if (password) {
        if (password.length < 8) {
          return setEditError("Password must contain atleast 8 character");
        } else {
          data.password = password;
        }
      }

      try {
        const updateUser = await fetch(
          `https://scotbackend.onrender.com/api/users/editUserAcc/${userInfo._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const response = await updateUser.json();

        console.log(response);

        if (response.status == 400) {
          setEditError(response.message);
        }

        cookie.remove("Scot_Auth-User_Data");
        cookie.set("Scot_Auth-User_Data", response.updatedUser);

        AuthContext.setEditUser(true);
      } catch (err) {
        console.log(err);
      }

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {AuthContext.editUser ? (
        <Notify type={"correct"} text={"User Update Successfuly"} />
      ) : null}
      <Contanior>
        <h1>
          <FaEdit className="editBtn" />
        </h1>
        {editError ? <h4 className="red">{editError}</h4> : null}
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          name="userName"
          placeholder="Enter your user name..."
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          placeholder="Enter your Email..."
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          placeholder="Edit your Password..."
        />
        <br />

        <div className="edit-back">
          <button onClick={(e) => navigate("/")}>
            <IoIosArrowRoundBack className="editCancleBtn" />
          </button>
          <button id="edit" onClick={(e) => editAcc()}>
            <FaEdit className="editBtn" />
          </button>
        </div>
      </Contanior>
    </>
  );
};

export default EditPage;
