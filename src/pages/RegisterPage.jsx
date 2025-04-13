import { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../desifnFiles/registerPage.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await registerUser(username, password);

            if (response.message) setMessage(response.message);

            if (response.ok) {
                navigate('/');
            } else {
                console.log(response.message || 'Помилка реєстрації');
            }
        } catch (error) {
            console.error('Помилка запиту:', error);
            alert('Помилка підключення до сервера');
        }
    };

    return (
        <div className="register-div">
            <h2 className="register-h2">Реєстрація</h2>
            <form className="register-form" onSubmit={handleRegister}>
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
                    Зареєструватися
                </button>
            </form>
            {message && <p className="regoster-p">{message}</p>}
            <button className="register-button" onClick={() => navigate('/login')}>
                Авторизація
            </button>
        </div>
    );
};

export default Register;
