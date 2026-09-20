import { createContext, useContext } from "react";

const UserContext = createContext();

const currentUser = {
    name: "SBA301 Student",
    role: "Learner",
};

function UserProvider({ children }) {
    return (
        <UserContext.Provider value={currentUser}>
            {children}
        </UserContext.Provider>
    );
}

function useUser() {
    return useContext(UserContext);
}

export { UserProvider, useUser };