import React, { useContext } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import auth from "../context/AuthContext";

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
      <img
        src="https://t4.ftcdn.net/jpg/04/98/72/43/360_F_498724323_FonAy8LYYfD1BUC0bcK56aoYwuLHJ2Ge.jpg"
        alt="User"
      />
      <h4>{userName}</h4>
      <h5>{email}</h5>
      <br />
      <button className="oprationButtons" onClick={(e) => signOut()}>
        Log Out
      </button>
      <button
        className="oprationButtons"
        onClick={(e) => navigate("/editAcc")}
        id="edit"
      >
        Edit
      </button>
      <button
        className="oprationButtons"
        onClick={(e) => deleteAcc()}
        id="deleteAcc"
      >
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
