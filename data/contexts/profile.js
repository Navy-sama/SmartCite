import {createContext, useContext, useState} from "react";

const ProfileContext = createContext()

export const useProfile = () => useContext(ProfileContext)

const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);

    // Some handlers
    const handleSetProfile = profile => {
        setProfile(profile);
    };

    const handleClearProfile = () => {
        setProfile(null);
    };

    const contextValue = {
        profile,
        handleSetProfile,
        handleClearProfile,
    };

    return (
        <ProfileContext.Provider value={contextValue}>
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileProvider;

