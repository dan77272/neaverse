// components/AddFriendButton.js
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';  // assuming you're using axios
import styles from './AddFriendButton.module.scss'
import { UserContext } from '@/UserContext';


export default function AddFriendButton({ targetUserId, firstName, lastName, buttonText }) {
  const {id} = useContext(UserContext)
  const [request, setRequest] = useState('Add Friend')

  useEffect(() => {
    setRequest(buttonText)
  }, [])
  
  async function handleAddFriend() {
    try {
      const response = await axios.post('/api/addFriend', {
        friendId: targetUserId,
        firstName: firstName,
        lastName: lastName,
        id: id
      });
      setRequest(response.data.requestButton)
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return (
    <button className={styles.addFriendButton} onClick={handleAddFriend} disabled={buttonText === 'Request Sent' || buttonText === 'Friends'}>
      {request}
    </button>
  );
}
