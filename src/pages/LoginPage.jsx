import { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate } from "react-router-dom";

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
        <div>
            <h2>Авторизація</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Увійти</button>
            </form>
            {message && <p>{message}</p>}
            <button onClick={() => {navigate('/register')}}>Реєстрація</button>
        </div>
    );
};

export default Login;
