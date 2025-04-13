import { useEffect, useState } from 'react';
import { getUserBalance, updateUserBalance } from '../services/balanceService';
import { findUser } from '../services/otherService';
import '../desifnFiles/transferPage.css';

export default function Transfer() {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0);
    const [otherUsername, setOtherUsername] = useState('');
    const [tBalance, setTBalance] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            getUserBalance(parsedUser.username).then((res) => {
                setBalance(res.balance);
            });
        }
    }, []);

    const transfer = async () => {
        try {
            const foundUser = await findUser(otherUsername);

            if (!foundUser) {
                alert('Користувача не знайдено');
                return;
            }

            const transferBalance = Number(tBalance);

            if (foundUser.username === user.username) {
                alert('Ви не можете переказати кошти самі собі!');
                return;
            }

            if (transferBalance <= 0) {
                alert('Введіть коректну суму!');
                return;
            }

            if (balance < transferBalance) {
                alert('На вашому рахунку недостатньо коштів для цієї операції');
                return;
            }

            await updateUserBalance(foundUser._id, transferBalance);

            const userBalance = balance - transferBalance;
            await updateUserBalance(user.userId, -transferBalance);
            setBalance(userBalance);

            alert('Операція переказу пройшла успішно!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="transfer-container">
            {user ? (
                <>
                    <h1 className="transfer-header">🔃Переказ коштів</h1>
                    <p className="transfer-text">Для переказу, просто введіть ім'я іншого користувача</p>
                    <div className="transfer-form">
                        <input
                            type="text"
                            placeholder="Username"
                            value={otherUsername}
                            onChange={(e) => setOtherUsername(e.target.value)}
                            required
                            className="input-field"
                        />
                        <input
                            type="number"
                            placeholder="Сума для переказу"
                            value={tBalance}
                            onChange={(e) => setTBalance(e.target.value)}
                            required
                            className="input-field"
                        />
                        <button onClick={transfer} className="transfer-button">
                            Переказ коштів
                        </button>
                    </div>
                    <div className="balance-info">
                        <p>Ім'я користувача: {user.username}</p>
                        <p>Баланс користувача: {balance}</p>
                    </div>
                </>
            ) : (
                <p>Перенаправлення...</p>
            )}
        </div>
    );
}
