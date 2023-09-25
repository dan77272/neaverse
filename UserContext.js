import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export default function UserContextProvider({ children }) {
  const [email, setEmail] = useState(null);
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        setEmail(user.email);
        setId(user._id);
      }
      setIsLoading(false); // Set isLoading to false after values are fetched
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return null; // Return a loading state or spinner while values are being fetched
  }

  return (
    <UserContext.Provider value={{ email, setEmail, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
