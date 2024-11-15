import { useContext, useState } from 'react';
import styles from './login.module.scss';
import axios from 'axios';
import Link from 'next/link';
import { UserContext } from '@/UserContext';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setEmail: setLoggedInEmail, setId } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { email, password };
    const response = await axios.post('/api/login', data);
    setLoggedInEmail(email);
    setId(response.data._id);
    localStorage.setItem('loggedInUser', JSON.stringify(response.data));
    Cookies.set('userId', response.data._id);
    router.push('/');
  }

  return (
    <div className={styles.register}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Neaverse</h1>
          <p>
            Dive into our community where you can freely express your thoughts, share photos, and interact with other members.
            Like posts that resonate with you, comment on people's updates, and customize your view with our dark/light mode toggle.
            Don't just be an observer; be part of the conversation. Sign in now and start connecting.
          </p>
        </div>
        <div className={styles.form}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type='email'
                id="email"
                placeholder='Email address'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type='password'
                id="password"
                placeholder='Password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type='submit'>Log In</button>
          </form>
          <div className={styles.newAccount}>
            <Link href={'/register'}>Create New Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
