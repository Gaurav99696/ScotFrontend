import React, { useContext } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import auth from "../context/AuthContext";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";

const Profile = ({ userName, email }) => {
  const cookie = new Cookies(null, "/");
  const navigate = useNavigate();

  const AuthContext = useContext(auth);

  const signOut = () => {
    cookie.remove("Scot_Auth-User_Data");
    cookie.remove("Scot_Auth-Token");
    navigate("/");
    AuthContext.setLogOut(true);
  };

  const deleteAcc = async () => {
    const userName = cookie.get("Scot_Auth-User_Data").userName;
    const deleteAcc = await fetch(
      `https://scotbackend.onrender.com/api/users/deleteUser/${userName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    cookie.remove("Scot_Auth-User_Data");
    cookie.remove("Scot_Auth-Token");
    navigate("/");
    AuthContext.setDeleteUser(true);
  };

  return (
    <div className="profile">
      <FaUserCircle className="userIcon large" />
      <h4>{userName}</h4>
      <h5>{email}</h5>
      <br />
      <div className="logOutEdit">
        <button className="oprationButtons" onClick={(e) => signOut()}>
          <FiLogOut />
        </button>
        <button
          className="oprationButtons"
          onClick={(e) => navigate("/editAcc")}
          id="edit"
        >
          <FaEdit />
        </button>
      </div>
      <button
        className="oprationButtons"
        onClick={(e) => deleteAcc()}
        id="deleteAcc"
      >
        <MdDeleteForever />
      </button>
    </div>
  );
};

export default Profile;
