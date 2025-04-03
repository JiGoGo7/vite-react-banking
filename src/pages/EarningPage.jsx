import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { getUserBalance, updateUserBalance } from '../services/balanceService';

export default function Earnings() {
    const [count, setCount] = useState(0);
    const [balance, setBalance] = useState(0);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            getUserBalance(parsedUser.username).then((res) => {
                setBalance(res.balance);
            });
        }
    }, [navigate]);

    const saveToBalance = async () => {
        if (user) {
            const newBalance = balance + count;
            await updateUserBalance(user.userId, count);
            setBalance(newBalance);
            setCount(0);
        }
    };

    return (
        <>
            <div>
                {user ? (
                    <>
                        <button onClick={() => { navigate('/') }}>Головна</button>
                        <button onClick={() => { navigate('/aboutus') }}>Про нас</button>
                        <button onClick={() => { navigate('/transfer') }}>Переказ</button>
                        <button onClick={() => { navigate("/credit") }}>Кредит</button>
                        <button
                            onClick={() => {
                                logoutUser();
                                navigate('/login');
                            }}>
                            Вийти
                        </button>
                    </>
                ) : (
                    <p>Перенаправлення...</p>
                )}
            </div>
            <h1>Заробіток</h1>
            <div className="card">
                <button onClick={() => setCount(count + 1)}>Клікай та заробляй! {count}</button>
                <button onClick={saveToBalance}>Збереження ваших коштів</button>
                <p>Ваш баланс: {balance}₴</p>
                <p>Тільки у нас ви можете прямо на сайті заробити гроші!</p>
            </div>
        </>
    );
}
