import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import auth from "../context/AuthContext";

const Form = ({ forSingUp }) => {
  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [logInError, setLogInError] = useState("");
  let [singUpError, setSingUpError] = useState("");

  const cookie = new Cookies(null, "/");

  const navigate = useNavigate();
  const authContext = useContext(auth);

  useEffect(() => {
    if (logInError) {
      const timer = setTimeout(() => {
        setLogInError("");
      }, 5000);
    }
  }, [logInError]);

  useEffect(() => {
    if (singUpError) {
      const timer = setTimeout(() => {
        setSingUpError("");
      }, 5000);
    }
  }, [singUpError]);

  const createAccount = async (e) => {
    e.preventDefault();

    const regexEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

    if (regexEmail.test(email)) {
      if (password.length < 8) {
        return setSingUpError("Password must contain atleast 8 character");
      } else {
        const data = {
          userName,
          email,
          password,
        };

        const createAccount = await fetch(
          "https://scotbackend.onrender.com/api/users/register",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const response = await createAccount.json();

        if (response.message === "Success") {
          setEmail("");
          setPassword("");
          setUserName("");
          navigate("/verifyUser");
        } else {
          setSingUpError(response.message);
        }
      }
    } else {
      setSingUpError("Check Your email");
    }
  };

  const logIn = async (e) => {
    e.preventDefault();

    const regexEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

    if (regexEmail.test(email)) {
      if (password.length < 8) {
        return setLogInError("Password must contain at least 8 characters");
      } else {
        const data = {
          email,
          password,
        };

        const login = await fetch(
          "https://scotbackend.onrender.com/api/users/login",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const response = await login.json();

        if (response.message === "Success") {
          setEmail("");
          setPassword("");

          cookie.set("Scot_Auth-Token", response.isLogin.Authorization);
          cookie.set("Scot_Auth-User_Data", response.isLogin.data);

          authContext.setUser(response.isLogin?.data);
          navigate("/");
        } else {
          setLogInError(response.message);
        }
      }
    } else {
      setLogInError("Check Your email");
    }
  };

  return (
    <form>
      {forSingUp ? <h2>Sing Up</h2> : <h2>Log in</h2>}
      {forSingUp ? (
        <h4 className="red">{singUpError}</h4>
      ) : (
        <h4 className="red">{logInError}</h4>
      )}
      {forSingUp ? (
        <>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            name="userName"
            placeholder="Enter your user name..."
          />
        </>
      ) : null}

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
        placeholder="Enter your Password..."
      />
      <br />
      {forSingUp ? (
        <button onClick={(e) => createAccount(e)}>Sing Up</button>
      ) : (
        <button onClick={(e) => logIn(e)}>Log In</button>
      )}

      {forSingUp ? (
        <h4>
          Have an account? <Link to="/login">Log In</Link>
        </h4>
      ) : (
        <h4>
          Don't have an account? <Link to="/singUp">Sing Up</Link>
        </h4>
      )}
    </form>
  );
};

export default Form;
