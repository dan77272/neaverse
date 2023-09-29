import Navbar from '@/components/Navbar/Navbar'
import styles from './settings.module.scss'

export default function Settings(){
    return (
        <div className={styles.settings}>
            <Navbar/>
            Settings
        </div>
    )
}