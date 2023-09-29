import { createRef, useContext, useEffect, useRef, useState } from 'react'
import styles from './profile.module.scss'
import axios from 'axios'
import { useRouter } from 'next/router';
import { UserContext } from '@/UserContext';
import Navbar from '@/components/Navbar/Navbar';
import { useToggle } from '@/ToggleContext';
import Footer from '@/components/footer/footer';
import Link from 'next/link';

export default function Profile(){

    const router = useRouter();
    const [cover, setCover] = useState('https://calgary.citynews.ca/static/media/thumbnail-default.8990a232.png')
    const [profilePic, setProfilePic] = useState('https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [isCoverUploaded, setIsCoverUploaded] = useState(false)
    const [isProfileUploaded, setIsProfileUploaded] = useState(false)
    const [comment, setComment] = useState([])
    const [allPosts, setAllPosts] = useState([])
    const [cmnt, setCmnt] = useState('')
    const {id, firstName: fName, lastName: lName, profilePic: pPic} = useContext(UserContext)
    const {isToggled, toggle} = useToggle()
    const {id: userId} = router.query


    const menuRefs = useRef({});

    useEffect(() => {
        const handleOutsideClick = (event) => {
            let isInsideMenu = false;
            
            Object.values(menuRefs.current).forEach(ref => {
                if (ref && ref.contains(event.target)) {
                    isInsideMenu = true;
                }
            });
            
            if (!isInsideMenu) {
                // Close all menus if click is outside
                Object.values(menuRefs.current).forEach(ref => {
                    if (ref) {
                        ref.style.display = 'none';
                    }
                });
            }
        };
    
        // Add the listener
        document.addEventListener('mousedown', handleOutsideClick);
        
        return () => {
            // Cleanup the listener when component unmounts
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);
    

const toggleMenu = (postId) => {
    Object.keys(menuRefs.current).forEach((id) => {
        console.log(menuRefs.current[id])
        if (menuRefs.current[id]) { 
            if (id === postId) {
                // toggle the display of the current menu
                menuRefs.current[id].style.display = 
                    menuRefs.current[id].style.display === 'none' ? 'block' : 'none';
            } else {
                // ensure all other menus are hidden
                menuRefs.current[id].style.display = 'none';
            }
        }
    });
}


    useEffect(() => {
        
        if (userId) {
          axios.get(`/api/profile?id=${userId}`)
            .then(response => {
              setCover(response.data.cover || 'https://calgary.citynews.ca/static/media/thumbnail-default.8990a232.png'),
              setFirstName(response.data.firstName || ''),
              setLastName(response.data.lastName || ''),
              setProfilePic(response.data.photo || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png')
            })
            .catch(error => {
              console.log(error); // Handle error, e.g., show error message to the user
            });
        }
      }, [userId]);

      useEffect(() => {
        axios.get('/api/posts').then(response => {
            console.log(response.data)
            setAllPosts(response.data.sort((a, b) => {
                if(a.createdAt < b.createdAt) return 1;
                if(a.createdAt > b.createdAt) return -1;
                return 0;
            }).filter((post) => post.creator._id === userId))
        })
    }, [userId])


    useEffect(() => {
        if (isToggled) {
          document.body.style.backgroundColor = '#28282B';
        } else {
          document.body.style.backgroundColor = 'rgb(236, 235, 235)';
        }
      }, [isToggled]);

    async function uploadImages(ev, buttonPressed){
        const files = ev.target?.files
        if(files.length > 0){
            const data = new FormData()
            for(const file of files){
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data)
            const photo = res.data.secure_url
            if(buttonPressed === 'cover'){
                setCover(photo);
                setIsCoverUploaded(true)
            }else if(buttonPressed === 'profile'){
                setProfilePic(photo)
                setIsProfileUploaded(true)
            }
            
        }
        
    }

    async function saveCover(e){
        e.preventDefault()
        const data = {cover};
        await axios.put(`/api/profile?id=${id}`, data);
        router.push('/profile/'+id)
        setIsCoverUploaded(false)
    }

    async function saveProfile(e){
        e.preventDefault()
        const data = {profilePic};
        await axios.put(`/api/profile?id=${id}`, data);
        router.push('/profile/'+id)
        setIsProfileUploaded(false)
    }

    async function handleLikeClick(postId, index, type) {
        const data = { userId: id, type };
    
        try {
            const response = await axios.put('/api/posts?id=' + postId, data);
            console.log(response.data)
            const updatedPost = response.data;
    
            // Update the like information for the specific post in the 'allPosts' state
            setAllPosts(prevPosts => {
                const updatedPosts = [...prevPosts];
                updatedPosts[index] = updatedPost;
                return updatedPosts;
            });
        } catch (error) {
            console.error(error);
        }
    }

      function handleCommentClick(index){
        const newComment = [...comment]
        newComment[index] = !newComment[index]
        setComment(newComment)
      }

      async function handleCommentInput(e, postId, index, type){
        e.preventDefault();
        if (cmnt.trim() === '') {
          // Do not submit if the comment content is empty
          return;
        }
      
        const data = {
          userId: id,
          type: 'comment',
          comment: cmnt,
          firstName: fName,
          lastName: lName,
          profilePic: pPic || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png' // Pass the comment content to the server
        };

        try {
          // Send the comment data to the server to post the comment
          await axios.put('/api/posts?id=' + postId, data);
          const response = await axios.get(`/api/posts`);
          // Update the comments information for the specific post in the 'allPosts' state
          setAllPosts(response.data.filter((post) => post.creator._id === userId));
          // Clear the comment input field after posting
          setCmnt('');
          console.log(allPosts)
        } catch (error) {
          console.error(error);
        }
      }


      async function deletePost(postId) {
        try {
            await axios.delete('/api/posts?id=' + postId);
            
            // Filter out the deleted post from the state
            const updatedPosts = allPosts.filter(post => post._id !== postId);
            setAllPosts(updatedPosts);
        } catch (error) {
            console.error("Error deleting the post:", error);
            // Handle error (for example: show an error message to the user)
        }
    }

    function timeDifference(createdDateStr) {
        const createdDate = new Date(createdDateStr);
        const currentDate = new Date();
    
        const diffMilliseconds = currentDate - createdDate;
        
        const diffSeconds = Math.floor(diffMilliseconds / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
    
        if (diffDays > 0) {
            return `${diffDays} days ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hours ago`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes} minutes ago`;
        } else {
            return 'Just now';
        }
    }


    return (
        <div className={styles.profile}>
            <Navbar/>
            <div className={styles.top}>
                <div className={styles.images}>
                    <img height='450px' style={{minWidth:'65%'}} src={cover} className={styles.img}/>
                </div>

                <div className={styles.upload}>
                {userId === id &&
                    <>
                    {
                    !isCoverUploaded ?
                    <label className={styles.photoButton}>
                        <svg height='30px' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                        </svg>
                            Edit Cover Photo
                        <input type="file" onChange={(ev) => uploadImages(ev, 'cover')} style={{display: 'none'}}/>
                    </label>
                        :    <button type="button" onClick={saveCover} className={styles.button}>Save</button>

                    }
                    </>}
                </div>

                <div className={styles.profilePic}>
                    <div className={styles.uploadPfp}>
                        <img height='180px' width='180px' src={profilePic} className={styles.pfp}/>
                        {userId === id &&
                        <>
                        {!isProfileUploaded ? 
                        <label className={styles.pfpButton}>
                            <svg height='60px' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                            </svg>
                            <input type="file" onChange={(ev) => uploadImages(ev, 'profile')} style={{display: 'none'}}/>
                        </label>
                        : <button type="button" onClick={saveProfile} className={styles.button}>Save</button>
                        }
                        </>}
                    </div>
                        <h2 style={isToggled ? {color: 'white'} : {}}>{firstName + " " + lastName}</h2>
                </div>
            </div>
            <div className={styles.posts}>
                {allPosts.map((post, index) => 
                <div className={styles.post} key={post._id} style={isToggled ? {backgroundColor: '#36454F'}: {}}>
                    <div className={styles.user}>
                        <div className={styles.userInfo}>
                                    <div className={styles.image}>
                                        <img height='40' width='40' src={post.creator?.photo || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'}/>
                                        
                                    </div>
                                    <div className={styles.userInfoSub}>
                                        <Link className={styles.username} href={'/profile/' + post.creator._id} style={isToggled ? {color: 'white'} : {}}>{post.creator?.firstName + " " + post.creator?.lastName}</Link>
                                        <p className={styles.date}>{timeDifference(post.createdAt)}</p>
                                    </div>
                                    
                            </div>
                        <div className={styles.options}>
                                <svg onClick={() => toggleMenu(post._id)} height='30px' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                                {post.creator._id === id ?
                                        <ul ref={ref => menuRefs.current[post._id] = ref} style={{display: 'none'}}>
                                            <li className="menu-item" onClick={() => deletePost(post._id)}> 
                                                <p>Delete</p>
                                            </li>
                                            <li>
                                                <p>Edit</p>
                                            </li>
                                        </ul>
                                : ""}
                        </div>
                    </div>
                    {post.content.endsWith(".png") || post.content.endsWith(".jpg") ? <img src={post.content}/> : <div style={isToggled ? {color: 'white'} : {}}>{post.content}</div>}
                    <p style={{ ...isToggled ? {color: 'white'} : {}, fontSize: '14px', margin: 0}}>{post.likes} Likes</p>
                    <hr style={{color: 'black'}}/>
                    <div className={styles.buttons}>
                        <button type='button' onClick={() => handleLikeClick(post._id, index, 'like')} style={post.like.includes(id.toString()) ? {...isToggled ? {color: '#DDC077'} : {color: 'blue'}} : {...isToggled ? {color: 'white'} : {color: 'black'}}}>
                            <svg height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                            </svg>
                            Like
                        </button>
                        <button type='button' onClick={() => handleCommentClick(index)} style={isToggled ? {color: 'white'}: {}}>
                            <svg height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                            Comment
                        </button>
                    </div>
                    <hr style={{color: 'black'}}/>
                    {comment[index] ?
                    <form className={styles.form} onSubmit={(e) => handleCommentInput(e, post._id, 'comment')}>
                        <div className={styles.comment}>
                            <input className={styles.commentInput} value={cmnt} onChange={e => setCmnt(e.target.value)} placeholder='Write a comment...'/>
                            <button className={styles.inputButton} type='submit'>Post Comment</button>
                        </div>
                        {post.comments.map((p, index) => (
                            <div className={styles.commentII} key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                                <div className={styles.commentImg}>
                                    <img style={{ borderRadius: '50%', border: '1px solid black' }} height='30' width='30' src={p.profilePic} />
                                </div>
                                <div className={styles.commentSub} style={{ marginLeft: '3px', backgroundColor: 'lightGray', borderRadius: '5px', flex: '1', padding: '5px' }}>
                                    <p style={{ fontSize: '15px', margin: 0, fontWeight: 'bold' }}>
                                        {p.firstName} {p.lastName}
                                    </p>
                                    <p className={styles.commentContent} style={{ margin: 0, fontWeight: 'lighter' }}>{p.content}</p>
                                </div>
                            </div>
                            ))}
                    </form> : ""}
                </div>)}
            </div>
            <Footer/>
        </div>
    )
}