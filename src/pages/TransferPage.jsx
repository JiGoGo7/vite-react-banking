import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService'
import { getUserBalance, updateUserBalance, findUser } from '../services/balanceService';

export default function Transfer() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0);
    const [otherUsername, setOtherUsername] = useState('');
    const [tBalance, setTBalance] = useState(0);

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

    const transfer = async () => {
        try {
            const foundUser = await findUser(otherUsername);

            if (!foundUser) {
                alert('Користувача не знайдено');
                return;
            }

            const transferBalance = Number(tBalance);
            
            if (foundUser.username == user.username) {
                alert('Ви не можете переказати кошти самі собі!');
                return;
            }

            if (transferBalance <= 0) {
                alert('Введіть коректну сумму!');
                return;
            }    

            if (balance < transferBalance) {
                alert('На вашому рахунку недостатньо коштів для цієї операції');
                return;
              }  

            const otherUserBalance = foundUser.balance + transferBalance;
            await updateUserBalance(foundUser.username, otherUserBalance);

            const userBalance = balance - transferBalance;
            await updateUserBalance(user.username, userBalance);
            setBalance(userBalance);

            alert('Операція переказу пройшла усішно!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div>
                {user ? (
                    <>
                        <button
                            onClick={() => {
                                navigate('/');
                            }}>
                            Головна
                        </button>
                        <button
                            onClick={() => {
                                navigate('/aboutus');
                            }}>
                            Про нас
                        </button>
                        <button
                            onClick={() => {
                                navigate('/earnings');
                            }}>
                            Заробіток
                        </button>
                        <button
                            onClick={() => {
                                logoutUser();
                                navigate('/login');
                            }}>
                            Вийти
                        </button>
                        <h1>Переказ коштів</h1>
                        <input
                            type="text"
                            placeholder="Username"
                            value={otherUsername}
                            onChange={(e) => setOtherUsername(e.target.value)}
                            required
                        />

                        <input
                            type="number"
                            placeholder="count"
                            value={tBalance}
                            onChange={(e) => setTBalance(e.target.value)}
                            required
                        />
                        <button onClick={transfer}>Переказ коштів</button>
                        <p>Ім'я користувача: {user.username}</p>
                        <p>Баланс користувача: {balance}</p>
                    </>
                ) : (
                    <p>Перенаправлення...</p>
                )}
            </div>
        </>
    );
}
