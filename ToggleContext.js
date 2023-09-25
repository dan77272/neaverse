import { createContext, useContext, useState } from 'react';


const ToggleContext = createContext();

export function useToggle() {
    return useContext(ToggleContext);
  }

export function ToggleProvider({children}){
    const [isToggled, setIsToggled] = useState(false)

    function toggle(){
        setIsToggled(!isToggled)
    }

    return (
        <ToggleContext.Provider value={{isToggled, toggle}}>
            {children}
        </ToggleContext.Provider>
    )
}