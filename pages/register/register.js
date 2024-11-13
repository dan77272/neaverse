import Link from 'next/link';
import styles from './register.module.scss';
import { useContext, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { UserContext } from '@/UserContext';
import Cookies from 'js-cookie';

export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [reEnterEmail, setReEnterEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { setEmail: setLoggedInEmail, setId } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();

    // Reset errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');

    // Validation
    let hasError = false;

    if (firstName.trim() === '') {
      setFirstNameError('First name is required');
      hasError = true;
    }

    if (lastName.trim() === '') {
      setLastNameError('Last name is required');
      hasError = true;
    }

    if (email.trim() === '' || reEnterEmail.trim() === '') {
      setEmailError('Email is required');
      hasError = true;
    } else if (email !== reEnterEmail) {
      setEmailError('Emails do not match');
      hasError = true;
    }

    if (password.trim() === '') {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (!hasError) {
      const data = { firstName, lastName, email, password };
      try {
        const response = await axios.post('/api/register', data);
        setLoggedInEmail(email);
        setId(response.data._id);
        localStorage.setItem('loggedInUser', JSON.stringify(response.data));
        Cookies.set('userId', response.data._id);
        router.push('/');
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  }

  return (
    <div className={styles.register}>
      <div className={styles.card}>
        <h2>Create New Account</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.nameFields}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name</label>
              <input
                type='text'
                id="firstName"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                aria-invalid={firstNameError ? 'true' : 'false'}
                required
              />
              {firstNameError && <div className={styles.error}>{firstNameError}</div>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type='text'
                id="lastName"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                aria-invalid={lastNameError ? 'true' : 'false'}
                required
              />
              {lastNameError && <div className={styles.error}>{lastNameError}</div>}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type='email'
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-invalid={emailError ? 'true' : 'false'}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="reEnterEmail">Re-enter Email</label>
            <input
              type='email'
              id="reEnterEmail"
              value={reEnterEmail}
              onChange={e => setReEnterEmail(e.target.value)}
              aria-invalid={emailError ? 'true' : 'false'}
              required
            />
            {emailError && <div className={styles.error}>{emailError}</div>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">New Password</label>
            <input
              type='password'
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              aria-invalid={passwordError ? 'true' : 'false'}
              required
            />
            {passwordError && <div className={styles.error}>{passwordError}</div>}
          </div>
          <button type='submit'>Create New Account</button>
        </form>
        <div className={styles.loginLink}>
          <Link href='/'>
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
