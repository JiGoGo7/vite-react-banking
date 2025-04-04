import { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate } from "react-router-dom";
import '../desifnFiles/registerPage.css'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await loginUser(username, password);

            if (response.message) setMessage(response.message);

            if (response.ok) {
                navigate('/');
            } else {
                setMessage(response.message || 'Помилка авторизації');
            }
        } catch (error) {
            console.error('Помилка запиту:', error);
            alert('Помилка підключення до сервера');
        }
    };

    return (
            <div className="register-div">
            <h2 className="register-h2">Авторизація</h2>
            <form className="register-form" onSubmit={handleLogin}>
                <input
                    className="register-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    className="register-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="register-button" type="submit">
                    Авторизуватися
                </button>
            </form>
            {message && <p className="regoster-p">{message}</p>}
            <button className="register-button" onClick={() => navigate('/register')}>
                Реєстрація
            </button>
        </div>
    );
};

export default Login;
