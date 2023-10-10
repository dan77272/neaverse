import Navbar from '@/components/Navbar/Navbar'
import styles from './settings.module.scss'
import Link from 'next/link'

export default function Settings(){
    return (
        <div className={styles.settings}>
            <Navbar/>
            <div className={styles.settingsOptions}>
                <Link className={styles.link} href={'/settings/change-name'}>Change Name</Link>
                <Link className={styles.link} href={'/settings/profile-visibility'}>Profile Visibility</Link>
            </div>
        </div>
    )
}