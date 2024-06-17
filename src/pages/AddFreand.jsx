import React, { useEffect, useState } from "react";
import Contanior from "../components/Contanior";
import Cookies from "universal-cookie";
import { FaUserCircle } from "react-icons/fa";
import { IoMdPersonAdd, IoIosArrowRoundBack } from "react-icons/io";
import Notify from "../components/Notify";
import { useNavigate } from "react-router-dom";

const AddFreand = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState();
  const [addFraend, setAddFraend] = useState(false);

  const userData = cookies.get("Scot_Auth-User_Data");

  useEffect(() => {
    const fetchSingleUser = async () => {
      const userName = userData.userName;
      try {
        const getSingleUser = await fetch(
          `https://scotbackend.onrender.com/api/users/getSingleUser/${userName}`
        );
        const response = await getSingleUser.json();

        if (response.message == "Success") {
          if (response.getUser.freand == 0) {
            const getAllContacts = async () => {
              try {
                const getContacts = await fetch(
                  `https://scotbackend.onrender.com/api/users/getAllUsers/${userData.userName}`
                );
                const response = await getContacts.json();
                setAllUsers(response.getUsers);
              } catch (error) {
                console.error("Error fetching users:", error);
              }
            };

            getAllContacts();
          } else {
            const getNonFreands = async () => {
              try {
                const nonFreands = await fetch(
                  `http://localhost:5001/api/users/getUnknownPeople/${userData._id}`
                );
                const response = await nonFreands.json();

                setAllUsers(response.nonFreand);
              } catch (error) {
                console.error("Error fetching users:", error);
              }
            };

            getNonFreands();
          }
        }
      } catch (error) {
        console.error("Error fetching single user:", error);
      }
    };

    fetchSingleUser();
  }, []);

  const addFreand = async (id) => {
    const data = { user: userData._id };
    try {
      const addFriend = await fetch(
        `http://localhost:5001/api/users/addFeand/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      setAddFraend(true);
    } catch (error) {
      console.error("Error fetching single user:", error);
    }
  };

  useEffect(() => {
    if (addFraend) {
      const timer = setTimeout(() => {
        setAddFraend(false);
      }, 3000);
    }
  }, [addFraend]);

  return (
    <>
      <Contanior>
        <IoIosArrowRoundBack
          className="backBtn addFeandBckBtn"
          onClick={() => navigate("/")}
        />

        {addFraend ? <Notify type={"correct"} text={"User Added"} /> : null}
        <h2 className="underline">Add Fraends</h2>
        {allUsers ? (
          allUsers.map((user) => (
            <div className="contactNumbes" key={user._id}>
              <p>
                <div className="flex">
                  <FaUserCircle className="userIcon" />
                  {user.userName}
                </div>
              </p>

              <button
                className="oprationButtons"
                id="edit"
                onClick={() => addFreand(user._id)}
              >
                <IoMdPersonAdd />
              </button>
            </div>
          ))
        ) : (
          <h2>Loading....</h2>
        )}
      </Contanior>
    </>
  );
};

export default AddFreand;
