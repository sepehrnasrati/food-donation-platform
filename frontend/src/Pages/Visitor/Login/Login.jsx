import styles from './Login.module.css'
import brunelLogo from "/src/assets/brunel-logo.png";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setTestUser, setToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // React Router hook for navigation

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError('Invalid email format');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/login', { email, password });
            if (response.status === 200) {
                console.log("Logged in successfully.");
                setTestUser(response.data);
                const jwtToken = response.headers.authorization.split(' ')[1]
                if (jwtToken !== null) {
                    setToken(jwtToken);
                } else {
                    alert("Could not get a valid token.");
                    setToken(null);
                }
            }

            setEmail('');
            setPassword('');

            navigate('/');
        } catch (error) {
            console.log("Error: " + error);

            if (error.response.status) {
                alert('Your email or password is incorrect.');
            } else {
                alert("Login error. Please see console for more details.")
            }
            setToken(null);
        }
    };

    return (
        /*
         Please write all of your code in <main>

         NOTE: this needs to have a className of "fullscreen" so there are
          no conflicts between the CSS of the main part of the app
         */
        <main className="fullscreen">
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <div className={styles.logoContainer}><img className={styles.logo} src={brunelLogo} /></div>
                    <h1 className={styles.title}>Welcome back!</h1>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <label>
                            <input className={styles.emailInput} placeholder='Enter your email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <label>
                            <input className={styles.passwordInput} placeholder='Enter your password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <div className={styles.buttonContainer}><button className={styles.button} type="submit">Continue</button></div>
                        {error && <div style={{ color: 'red' }}>{error}</div>}
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Login;