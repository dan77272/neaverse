import { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';


const ToggleContext = createContext();

export function useToggle() {
    return useContext(ToggleContext);
  }

export function ToggleProvider({children}){
    const [isToggled, setIsToggled] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false)
    const {id} = useContext(UserContext)
    
    
    useEffect(() => {
        async function fetchUserVisibility() {
            if(id){
                try {
                    const response = await axios.get(`/api/users?id=${id}`);  // Assuming you have an endpoint that gets a user by ID
                    const userData = response.data;
                    setIsPrivate(userData.visibility);  // Set the visibility value fetched from the database
                } catch (error) {
                    console.error('Failed to fetch user visibility:', error);
                }
            }

        }

        fetchUserVisibility();
    }, [id]);

    function toggle(){
        setIsToggled(!isToggled)
    }

    function toggleVisibility(){
        setIsPrivate(!isPrivate)
    }

    return (
        <ToggleContext.Provider value={{isToggled, toggle, isPrivate, toggleVisibility}}>
            {children}
        </ToggleContext.Provider>
    )
}