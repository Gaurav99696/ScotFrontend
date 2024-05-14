import { useState, createContext } from "react";

const auth = createContext()

export const AuthContext = (props) => {

    const [ user, setUser ] = useState()

    return (
        <auth.Provider value={{user, setUser}}>
            {props.children}
        </auth.Provider>
    )
}

export default auth