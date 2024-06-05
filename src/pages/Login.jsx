import React, { useContext, useEffect } from "react";
import Form from "../components/Form";
import Contanior from "../components/Contanior";
import Notify from "../components/Notify";
import auth from "../context/AuthContext";

const Login = () => {
  const authContext = useContext(auth);

  useEffect(() => {
    if (authContext.logOut) {
      const timer = setTimeout(() => {
        authContext.setLogOut(false);
      }, 3000);
    }
    if (authContext.deleteUser) {
      const timer = setTimeout(() => {
        authContext.setDeleteUser(false);
      }, 3000);
    }
  }, [authContext.logOut, authContext.setDeleteUser]);

  return (
    <Contanior>
      {authContext.logOut ? (
        <Notify type={"danger"} text={"Loged Out Successfuly"} />
      ) : null}

      {authContext.deleteUser ? (
        <Notify type={"danger"} text={"User Deleted Successfuly"} />
      ) : null}
      <Form />
    </Contanior>
  );
};

export default Login;
