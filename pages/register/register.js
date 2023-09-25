import Link from 'next/link'
import styles from './register.module.scss'
import { useContext, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { UserContext } from '@/UserContext'


export default function Register(){

    const router = useRouter()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [reEnterEmail, setReEnterEmail] = useState('');
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const {setEmail: setLoggedInEmail, setId} = useContext(UserContext)

    async function handleSubmit(e){
        e.preventDefault()
        if(email.trim() === '' || reEnterEmail.trim() === ''){
            setEmailError('Email is required')
        }else if(email === reEnterEmail){
            console.log('email')
        }else{
            setEmailError('Emails do not match');
        }
        if(firstName.trim() === ''){
            setFirstNameError("First name is required")
        }else{
            setFirstNameError("")
        }
        if(lastName.trim() === ''){
            setLastNameError("Last name is required")
        }else{
            setLastNameError("")
        }
        if(password.trim() === ''){
            setPasswordError("Password is required")
        }else{
            setPasswordError("")
        }
        if(firstName && lastName && email && password && email === reEnterEmail){
            const data = {firstName, lastName, email, password}
            const response = await axios.post('/api/register', data)
            setLoggedInEmail(email)
            setId(data.id)
            localStorage.setItem('loggedInUser', JSON.stringify(response.data));
            router.push('/')
        }
    }

    return(
        <div className={styles.register}>
            <form onSubmit={handleSubmit}>
                <div className={styles.name}>
                    <input type='text' placeholder='First Name' value={firstName} onChange={e => setFirstName(e.target.value)}/>
                    <input type='text' placeholder='Last Name' value={lastName} onChange={e => setLastName(e.target.value)}/>
                </div>
                <div style={{display: 'flex', gap: 30}}>
                    {firstNameError && <p style={{color: 'red'}}>{firstNameError}</p>}
                    {lastNameError && <p style={{color: 'red'}}>{lastNameError}</p>}
                </div>
                <input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
                <input type='email' placeholder='Re-enter Email' value={reEnterEmail} onChange={e => setReEnterEmail(e.target.value)}/>
                {emailError && <p style={{color: 'red'}}>{emailError}</p>}
                <input type='password' placeholder='New Password' value={password} onChange={e => setPassword(e.target.value)}/>
                {passwordError && <p style={{color: 'red'}}>{passwordError}</p>}
                <button type='submit'>Create New Account</button>
                
            </form>
            <Link href={'/'}>Already have an account? Log in</Link>
        </div>
    )
}