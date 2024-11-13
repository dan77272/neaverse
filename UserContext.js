import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie'
export const UserContext = createContext({});

export default function UserContextProvider({ children }) {
  const [email, setEmail] = useState(null);
  const [id, setId] = useState(null);
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [profilePic, setProfilePic] = useState(null)
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const [friends, setFriends] = useState([])
  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = localStorage.getItem("loggedInUser");

      if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        Cookies.set('userId', user._id)
        setEmail(user.email);
        setId(user._id);
        setFirstName(user.firstName)
        setLastName(user.lastName)
        setProfilePic(user.photo)
        setFriends(user.friends)
      }
      setIsLoading(false); // Set isLoading to false after values are fetched
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return null; // Return a loading state or spinner while values are being fetched
  }

  return (
    <UserContext.Provider value={{ email, setEmail, id, setId, firstName, setFirstName, lastName, setLastName, profilePic, setProfilePic, friends, setFriends }}>
      {children}
    </UserContext.Provider>
  );
}
