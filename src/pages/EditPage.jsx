import { useEffect, useState } from "react";
import React from "react";
import Contanior from "../components/Contanior";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const EditPage = () => {
  const navigate = useNavigate();
  const cookie = new Cookies(null, "/");

  const userInfo = cookie.get("Scot_Auth-User_Data");

  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [response, setResponse] = useState(null);
  let [editError, setEditError] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const getUser = await fetch(
        `https://scotbackend.onrender.com/api/users/getSingleUser/${userInfo.userName}`
      );

      const response = await getUser.json();
      setResponse(response);
      setUserName(response.getUser.userName);
      setEmail(response.getUser.email);
    };
    getUser();
  }, [userInfo.userName]);

  useEffect(() => {
    if (editError) {
      const timer = setTimeout(() => {
        setEditError("");
      }, 5000);
    }
  }, [editError]);

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
      } else {
        data.password = response.getUser.password;
      }

      try {
        const updateUser = await fetch(
          `http://localhost:5001/api/users/editUserAcc/${userInfo._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const response = await updateUser.json();

        cookie.remove("Scot_Auth-User_Data");
        cookie.set("Scot_Auth-User_Data", response.updatedUser);

        console.log(response);
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
      <Contanior>
        <h1>Edit</h1>
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
          <button id="deleteAcc" onClick={(e) => navigate("/")}>
            Cancel
          </button>
          <button id="edit" onClick={(e) => editAcc()}>
            Edit
          </button>
        </div>
      </Contanior>
    </>
  );
};

export default EditPage;
