import { useContext, useEffect, useState } from 'react';
import styles from './login.module.scss'
import axios from 'axios'
import Link from 'next/link';
import { UserContext } from '@/UserContext';
import { useRouter } from 'next/router';
export default function Login(){

    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {setEmail: setLoggedInEmail, setId} = useContext(UserContext)

      async function handleSubmit(e){
        e.preventDefault()
        const data = {email, password}
        const response = await axios.post('/api/login', data)
        setLoggedInEmail(email)
        setId(response.data._id)
        localStorage.setItem('loggedInUser', JSON.stringify(response.data));
        router.push('/')
      }

    return (
        <div className={styles.register}>
            <div className={styles.title}>
                <h1>Neavrse</h1>
                <p>
                Dive into our community where you can freely express your thoughts, share photos, and interact with other members. 
                Like posts that resonate with you, comment on people's updates, and customize your view with our dark/light mode toggle. 
                Don't just be an observer; be part of the conversation. Sign in now and start connecting.</p>
            </div>
            <div className={styles.form}>
                <form onSubmit={handleSubmit}>
                    <input type='email' placeholder='Email address' value={email} onChange={e => setEmail(e.target.value)}/>
                    <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
                    <button type='submit'>Log In</button>
                    
                </form>
                <Link className={styles.newAccount} href={'/register'}>Create New Account</Link>
            </div>

        </div>
    )
}