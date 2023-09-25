import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import { useRouter } from "next/router";


export default function Routes(){
    const router = useRouter()
    const { email } = useContext(UserContext);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    if (!isLoaded) {
        return null; // Return a loading state or spinner while waiting for email value
    }

    if(email){
        router.push('/home')
    } else {
        return (
            <div>
                <Login />
            </div>
        );
    }
}