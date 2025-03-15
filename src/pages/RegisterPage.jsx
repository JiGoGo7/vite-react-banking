import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";


const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
    
        try {
            const response = await registerUser(username, password);
            console.log("Отримана відповідь:", response);
            
            if (response.message) setMessage(response.message);
            
            if (response.ok) {
                navigate('/');
            } else {
                console.log(response.message || "Помилка реєстрації");
            }
        } catch (error) {
            console.error("Помилка запиту:", error);
            alert("Помилка підключення до сервера");
        }
    };
    
    
    return (
        <div>
            <h2>Реєстрація</h2>
            <form onSubmit={handleRegister}>
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
                <button type="submit">Зареєструватися</button>
            </form>
            {message && <p>{message}</p>}
            <button onClick={() => {navigate('/login')}}>Авторизація</button>
        </div>
    );
};

export default Register;
