// Navbar.jsx

import Link from 'next/link';
import styles from './Navbar.module.scss';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/UserContext';
import axios from 'axios';
import { useToggle } from '@/ToggleContext';
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';

export default function Navbar() {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isToggled, toggle } = useToggle();
  const { id } = useContext(UserContext);

  // Fetch notifications
  useEffect(() => {
    const intervalId = setInterval(() => {
      axios
        .get('/api/notifications')
        .then((response) => {
          setNotifications(response.data.filter((notification) => notification.recipient === id));
        })
        .catch((error) => {
          console.error('Error fetching notifications:', error);
        });
    }, 60000); // Fetch every 60 seconds

    return () => clearInterval(intervalId);
  }, [id]);

  // Update unread notification count
  useEffect(() => {
    const unreadCount = notifications.filter((notification) => !notification.isRead).length;
    setUnreadNotificationCount(unreadCount);
  }, [notifications]);

  // Handle sign out
  function signOut() {
    localStorage.removeItem('loggedInUser');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }

  // Toggle mobile menu
  function toggleMobileMenu() {
    setMobileMenuOpen(!isMobileMenuOpen);
  }

  // Handle search input change
  function handleSearchChange(ev) {
    const value = ev.target.value;
    setSearchValue(value);

    // Fetch users from the API
    axios
      .get('/api/users')
      .then((response) => {
        const users = response.data;
        if (value === '') {
          setSuggestions([]);
        } else {
          const filteredUsers = users.filter((user) =>
            user.firstName.toLowerCase().includes(value.toLowerCase())
          );

          setSuggestions(filteredUsers);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Handle notification icon click
  function handleNotificationClick() {
    setIsNotificationOpen(!isNotificationOpen);

    if (unreadNotificationCount > 0) {
      // Resetting the local count
      setUnreadNotificationCount(0);
      // Optionally: API request to mark notifications as read in the backend
      axios
        .put('/api/notifications/')
        .then((response) => {
          console.log('Notifications marked as read', response.data);
        })
        .catch((error) => {
          console.error('Error marking notifications as read:', error);
        });
    }
  }

  // Handle friend request actions
  async function handleAccept(sender, recipient) {
    const data = {
      sender: sender,
      recipient: recipient,
    };
    try {
      await axios.put('/api/addFriend', data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDecline(sender, recipient) {
    try {
      await axios.delete('/api/declineFriend', {
        params: { sender, recipient },
      });
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  }

  async function handleOkay(sender, recipient) {
    try {
      await axios.delete('/api/addFriend', {
        params: { sender, recipient },
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav className={`${styles.navbar} ${isToggled ? styles.dark : ''}`}>
      <div className={styles.logo}>
        <Link href='/' className={styles.home}>
          Neavrse
        </Link>
      </div>

      <div className={styles.searchContainer}>
        <input
          className={styles.input}
          placeholder='Search'
          value={searchValue}
          onChange={handleSearchChange}
        />
        {suggestions.length > 0 && (
          <ul className={styles.suggestionList}>
            {suggestions.map((user) => (
              <li key={user._id} className={styles.suggestionItem}>
                <Link
                  href={'/profile/' + user._id}
                  className={styles.userSuggestion}
                  onClick={() => setSearchValue('')}
                >
                  <div className={styles.profilePicture}>
                    <img src={user.photo || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'} alt={`${user.firstName} ${user.lastName}`} />
                  </div>
                  <div className={styles.userName}>
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.right}>
        <button className={styles.toggleButton} onClick={toggle} aria-label='Toggle Theme'>
          {isToggled ? <FaMoon /> : <FaSun />}
        </button>

        <Link href={'/profile/' + id} className={styles.link}>
          <FaUserCircle /> <span>Profile</span>
        </Link>

        <div className={styles.notificationIconContainer} onClick={handleNotificationClick}>
          <FaBell className={styles.notificationIcon} />
          {unreadNotificationCount > 0 && (
            <span className={styles.notificationCount}>{unreadNotificationCount}</span>
          )}
          {isNotificationOpen && (
            <div className={styles.notificationDropdown}>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div key={index} className={styles.notificationItem}>
                    {notification.type === 'REQUEST_ACCEPTED' ? (
                      <>
                        <p>
                          {notification.recipientFirstName} {notification.recipientLastName} accepted
                          your friend request
                        </p>
                        <div className={styles.buttons}>
                          <button onClick={() => handleOkay(notification.sender._id, notification.recipient)}>
                            Okay
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>
                          {notification.sender.firstName} {notification.sender.lastName} sent you a
                          friend request
                        </p>
                        <div className={styles.buttons}>
                          <button onClick={() => handleAccept(notification.sender._id, notification.recipient)}>
                            Accept
                          </button>
                          <button onClick={() => handleDecline(notification.sender._id, notification.recipient)}>
                            Decline
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className={styles.noNotifications}>No new notifications</p>
              )}
            </div>
          )}
        </div>

        <Link href='/settings' className={styles.link}>
          <span>Settings</span>
        </Link>

        <button onClick={signOut} className={styles.signOutButton}>
          <FaSignOutAlt /> <span>Sign Out</span>
        </button>

        <button className={styles.hamburger} onClick={toggleMobileMenu} aria-label='Toggle Menu'>
          <FaBars />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href={'/profile/' + id} className={styles.mobileLink}>
            Profile
          </Link>
          <Link href='/settings' className={styles.mobileLink}>
            Settings
          </Link>
          <button onClick={signOut} className={styles.mobileSignOutButton}>
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
