import { useState, createContext } from "react";

const auth = createContext();

export const AuthContext = (props) => {
  const [user, setUser] = useState();
  const [logIn, setLogIn] = useState(false);
  const [logOut, setLogOut] = useState(false);
  const [register, setRegister] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [editUser, setEditUser] = useState(false);

  return (
    <auth.Provider
      value={{
        user,
        setUser,
        logIn,
        setLogIn,
        logOut,
        setLogOut,
        register,
        setRegister,
        deleteUser,
        setDeleteUser,
        editUser,
        setEditUser,
      }}
    >
      {props.children}
    </auth.Provider>
  );
};

export default auth;
