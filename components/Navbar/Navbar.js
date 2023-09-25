    import Link from 'next/link'
    import styles from './Navbar.module.scss'
    import { useRouter } from 'next/router';
    import { useContext, useState } from 'react';
    import { UserContext } from '@/UserContext';
    import axios from 'axios';
    import { useToggle } from '@/ToggleContext';

    export default function Navbar(){
        const [searchValue, setSearchValue] = useState('')
        const [suggestions, setSuggestions] = useState([])
        const [allUsers, setAllUsers] = useState([])
        const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
        const {isToggled, toggle} = useToggle()
        const {id} = useContext(UserContext)
        
        
        function signOut(){
            localStorage.removeItem('loggedInUser');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        }

        function toggleMobileMenu() {
            setMobileMenuOpen(!isMobileMenuOpen);
        }

        function handleSearchChange(ev) {
            const value = ev.target.value;
            setSearchValue(value);
        
            // Fetch users from the API
            axios.get('/api/users')
                .then(response => {
                    const users = response.data; // Assuming the API returns an array of user objects
                    if (value === '') {
                        setSuggestions([]);
                    } else {
                        // Filter users whose names include the search value
                        const filteredUsers = users.filter(user =>
                            user.firstName.toLowerCase().includes(value.toLowerCase())
                        );
        
                        // Generate links with the correct user IDs
                        const suggestionLinks = filteredUsers.map(user => (
                            <Link
                                onClick={() => {
                                    setSuggestions([]);
                                    setSearchValue('');
                                }}
                                style={{ textDecoration: 'none' }}
                                key={user._id}
                                href={'/profile/' + user._id}
                            >
                                <div className={styles.userSuggestion} style={isToggled ? {backgroundColor: '#36454F'}: {}}>
                                    <div className={styles.profilePicture}>
                                        <img src={user.photo} style={isToggled ? {border: '1px solid white'}: {}}/>
                                    </div>
                                    <div className={styles.userName} style={isToggled ? {color: 'white'}: {}}>
                                        <span>{user.firstName} {user.lastName}</span>
                                    </div>
                                </div>
                            </Link>
                        ));
        
                        setSuggestions(suggestionLinks);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }

        return (
            <div className={styles.navbar}>
                <div className={styles.logo}>
                    <Link className={styles.home} href={'/'} style={isToggled ? {color: 'white'}: {}}>Neavrse</Link>
                </div>
                <div className={styles.mid}>
                    <input className={styles.input} placeholder='Search' value={searchValue} onChange={handleSearchChange}/>
                    {suggestions.length > 0 && (
                        <ul className={styles.suggestionList}>
                            {suggestions.map((suggestion, index) => (
                                <li key={index} className={styles.suggestionItem} style={isToggled ? {backgroundColor: '#36454F'}: {}}>
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className={styles.hamburger} onClick={toggleMobileMenu}>
                        ☰
                </div>
                <div className={`${styles.right} ${isMobileMenuOpen ? styles.open : ''}`}>
                {isToggled ? 
                    <svg style={{marginRight: '10px'}} height='30px' xmlns="http://www.w3.org/2000/svg" color='white' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                : 
                    <svg style={{marginRight: '10px'}} height='30px' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                }


                        <input type='checkbox' checked={isToggled} onChange={toggle} className={styles.toggleCheckbox} id='toggle'/>
                        <label htmlFor="toggle" className={styles.toggleLabel}></label>
                        <Link className={styles.link} href={'/profile/'+id} style={isToggled ? {color: 'white'}: {}}>Profile</Link>
                        <button onClick={signOut} style={isToggled ? {color: 'white', backgroundColor: '#28282B'}: {}}>Sign Out</button>

                </div>
            </div>
        )
    }