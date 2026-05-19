import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('token') || false);
    const [userData, setUserData] = useState(false);

    const backendUrl = "https://newhms.onrender.com"; // Aapka backend URL

    const value = {
        token, setToken,
        backendUrl,
        userData, setUserData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;