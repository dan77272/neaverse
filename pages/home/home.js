import { UserContext } from "@/UserContext";
import HomePage from "@/components/HomePage/HomePage";
import Navbar from "@/components/Navbar/Navbar";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function Home(){
    const { email } = useContext(UserContext);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded && !email) {
            router.push('/login/login');
        }
    }, [email, isLoaded, router]);

    if (!isLoaded) {
        return null; // Return a loading state or spinner while waiting for email value
    }

    return (
        <div>
            <Navbar/>
            <HomePage/>
        </div>
    )
}