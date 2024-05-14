import React, { useState, useContext } from "react";
import Contanior from "../components/Contanior";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import auth from "../context/AuthContext";

const VerifyUser = () => {
  let [otp, setOtp] = useState("");
  let [email, setEmail] = useState("");
  let [error, setError] = useState("");

  const navigate = useNavigate();
  const cookie = new Cookies(null, "/");
  const AuthContext = useContext(auth) 

  const verifyUser = async (e) => {
    e.preventDefault();

    const regexEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

    if (otp.length < 4) {
      setError("OTP must contains 4 digits");
    } else {
      if (regexEmail.test(email)) {
        const data = {
          email,
          OTP: otp,
        };

        const verifyUser = await fetch(
          "http://localhost:5000/api/users/verifyUser",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const response = await verifyUser.json();

        if (response.message === "Success") {
          setEmail("");
          setOtp("");

          cookie.set("Scot_Auth-Token", response.verified.Authorization);
          cookie.set("Scot_Auth-User_Data", response.verified.user);

          AuthContext.setUser(response.verified.user)

          navigate("/");
        }else{
            setError(response.message)
        }
      } else{
        setError("Incorrect Email")
      }
    }
  };

  return (
    <Contanior>
      <h2>Let's Verify You</h2>
      <br />
      <h5>Enter the OTP that you have resevied on your Gmail!</h5>
      <br />

      <h4 className="red">{error}</h4>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter your OTP here..."
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your Email here..."
      />
      <button onClick={(e) => verifyUser(e)}>Submit</button>
    </Contanior>
  );
};

export default VerifyUser;
