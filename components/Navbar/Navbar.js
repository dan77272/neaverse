    import Link from 'next/link'
    import styles from './Navbar.module.scss'
    import { useRouter } from 'next/router';
    import { useContext, useEffect, useState } from 'react';
    import { UserContext } from '@/UserContext';
    import axios from 'axios';
    import { useToggle } from '@/ToggleContext';

    export default function Navbar(){
        const [searchValue, setSearchValue] = useState('')
        const [suggestions, setSuggestions] = useState([])
        const [allUsers, setAllUsers] = useState([])
        const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
        const [notifications, setNotifications] = useState([]);
        const [newNotification, setNewNotification] = useState(false);
        const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
        const [isNotificationOpen, setIsNotificationOpen] = useState(false);
        const {isToggled, toggle} = useToggle()
        const {id} = useContext(UserContext)


        useEffect(() => {
            const intervalId = setInterval(() => {
                // Fetch notifications from API
                axios.get('/api/notifications')
                    .then(response => {
                        if (response.data.some(notification => !notification.isRead)) {
                            setNewNotification(true);
                        }
                        console.log("data: " + response.data)
                        setNotifications(response.data.filter((notification) => notification.recipient === id));
                    })
                    .catch(error => {
                        console.error("Error fetching notifications:", error);
                    });
            }, 1000);  // fetch every 60 seconds, adjust as needed
    
            return () => clearInterval(intervalId); // cleanup interval on component unmount
        }, []);


        useEffect(() => {
            // Update unread count whenever notifications change
            const unreadCount = notifications.filter(notification => !notification.isRead).length;
            setUnreadNotificationCount(unreadCount);
        }, [notifications]);
        
        
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

        function handleNotificationClick() {
            setIsNotificationOpen(!isNotificationOpen);
            
            if (unreadNotificationCount > 0) {
                // Resetting the local count
                setUnreadNotificationCount(0);
                setNewNotification(false);
                // Optionally: API request to mark notifications as read in the backend
                axios.put('/api/notifications/')
                    .then(response => {
                        console.log('Notifications marked as read', response.data);
                    })
                    .catch(error => {
                        console.error('Error marking notifications as read:', error);
                    });
            }
        }

        useEffect(() => {
            console.log('Notifications:', notifications);
        }, [notifications]);
        

        function NotificationIcon({unreadCount, hasNew}) {
            return (
                <div className={styles.notificationIconContainer} onClick={handleNotificationClick}>
                    <svg height={25} xmlns="http://www.w3.org/2000/svg" fill={hasNew ? "red" : "none"} viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    {unreadCount > 0 && (
                        <span className={styles.notificationCount}>
                            {unreadCount}
                        </span>
                    )}
                    {isNotificationOpen && (
                        <div className={styles.notificationDropdown}>
                            {notifications.map((notification, index) => (
                                <div key={index} className={styles.notificationItem}>
                                    {
                                    
                                    notification.type === "REQUEST_ACCEPTED" ?<> <p>{notification.recipientFirstName} {notification.recipientLastName} accepted your friend request</p>
                                        <div className={styles.buttons}>
                                            <button onClick={() => handleOkay(notification.sender._id, notification.recipient)}>Okay</button>
                                        </div>
                                    </> :
                                    <>
                                        <p>{notification.sender.firstName} {notification.sender.lastName} sent you a friend request</p>
                                        <div className={styles.buttons}>
                                            <button onClick={() => handleAccept(notification.sender._id, notification.recipient)}>Accept</button>
                                            <button onClick={() => handleDecline(notification.sender._id, notification.recipient)}>Decline</button>
                                        </div>
                                    </>
                                    }
                                </div>
                            ))}
                        </div>
                    )}
                    
                </div>
            );
        }

        async function handleOkay(sender, recipient){
            try{
                await axios.delete('/api/addFriend', {
                    params: { sender, recipient }
                })
            } catch (error) {
                console.error(error);
            }
        }

        async function handleDecline(sender, recipient){
            try {
                // Use axios to send a DELETE request with parameters in the URL
                await axios.delete('/api/declineFriend', { 
                    params: { sender, recipient }
                });
                // Handle success
            } catch (error) {
                console.error("Error:", error.response ? error.response.data : error.message);
                // Handle error
            }
        }

        async function handleAccept(sender, recipient){
            const data = {
                sender: sender,
                recipient: recipient
            }
            try {
                await axios.put('/api/addFriend', data)
            } catch (error) {
                console.error(error);
            }
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
                        <NotificationIcon unreadCount={unreadNotificationCount} hasNew={newNotification} />
                        <Link className={styles.link} href={'/settings'} style={isToggled ? {color: 'white'}: {}}>Settings</Link>
                        <button onClick={signOut} style={isToggled ? {color: 'white', backgroundColor: '#28282B', padding: '0', marginTop: '1px'}: {padding: '0', marginTop: '1 px'}}>Sign Out</button>

                </div>
            </div>
        )
    }