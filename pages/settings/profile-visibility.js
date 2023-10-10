import Navbar from '@/components/Navbar/Navbar'
import styles from './profile-visibility.module.scss'
import { useToggle } from '@/ToggleContext'
import axios from 'axios'
import { useContext, useEffect } from 'react'
import { UserContext } from '@/UserContext'

export default function profileVisibility(){

    const {isPrivate, toggleVisibility} = useToggle()
    const {id} = useContext(UserContext)
    async function setVisibility(type){
        toggleVisibility()
        const data = {id, isPrivate, type}
        await axios.put('/api/users', data)
    }

    return (
        <div className={styles.profileVisibility}>
            <Navbar/>
            <div className={styles.setVisibility}>
                <p className={styles.pv}>Set Profile Visibility: </p>
                <div className={styles.porp}>
                    <p>Public</p>
                    <input type='checkbox' checked={isPrivate} onChange={() => setVisibility('visibility')} className={styles.toggleCheckbox} id='toggleVisibility'/>
                    <label htmlFor="toggleVisibility" className={styles.toggleLabel}></label>
                    <p>Private</p>
                </div>

            </div>
        </div>
    )
}