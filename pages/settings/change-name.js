import Navbar from '@/components/Navbar/Navbar'
import styles from './changeName.module.scss'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserContext } from '@/UserContext'

export default function ChangeName(){

    const [newName, setNewName] = useState('')
    const [newLastName, setNewLastName] = useState('')
    const [success, setSuccess] = useState(false)
    const {id} = useContext(UserContext)


    useEffect(() => {
        setSuccess(false)
    }, [])

    async function handleNameChange(e){
        const data = {id, newName, newLastName}
        e.preventDefault()
        try {
            await axios.put('/api/users', data);
            setSuccess(true);
        } catch (error) {
            console.error("Error updating name:", error);
        }
    }

    return (
        <div className={styles.changeName}>
            <Navbar/>
            {success ? <p>Name changed successfully</p> 
            : <div className={styles.changeNameSub}>
                <form onSubmit={(e) => handleNameChange(e)}>
                    <label>Enter New First Name</label>
                    <input value={newName} onChange={e => setNewName(e.target.value)}/>
                    <label>Enter New Last Name</label>
                    <input value={newLastName} onChange={e => setNewLastName(e.target.value)}/>
                    <button type='submit'>Submit</button>
                </form>

        </div>}


        </div>
    )
}