import {createContext, useContext, useState} from "react";

const UserContext = createContext({
    user: null,
    Login: (user) => {},
    Logout: () => {}
})

export const useUser = () => useContext(UserContext)

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Some handlers
    const handleLogin = user => {
        setUser(user);
    };

    const handleLogout = () => {
        setUser(null);
    };

    const contextValue = {
        user,
        Login: handleLogin,
        Logout: handleLogout,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;

