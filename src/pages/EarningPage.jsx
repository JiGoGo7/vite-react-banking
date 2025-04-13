import { useEffect, useState } from 'react';
import { getUserBalance, updateUserBalance } from '../services/balanceService';
import '../desifnFiles/earningPage.css';
import '../desifnFiles/navBar.css';

export default function Earnings() {
    const [coins, setCoins] = useState([]);
    const [count, setCount] = useState(0);
    const [balance, setBalance] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const coinElements = [];
        for (let i = 0; i < 10; i++) {
            coinElements.push(<div key={i} className="coin"></div>);
        }
        setCoins(coinElements);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            getUserBalance(parsedUser.username).then((res) => {
                setBalance(res.balance);
            });
            console.log('User from localStorage:', parsedUser);
        }
    }, []);

    const saveToBalance = async () => {
        if (user) {
            const newBalance = balance + count;
            await updateUserBalance(user.userId, count);
            setBalance(newBalance);
            setCount(0);
        }
    };

    return (
        <div className="earnings-container">
            {user ? (
                <>
                    {coins}
                    <h1>💰 Заробіток на сайті</h1>
                    <p className="description">Натискайте кнопку, щоб заробляти гроші, і зберігайте їх на балансі.</p>
                    <p className="balance-text">
                        Ваш баланс: <span className="money">{balance}₴</span>
                    </p>
                    <div className="card">
                        <button className="earn-button" onClick={() => setCount(count + 1)}>
                            💰 Клікай та заробляй! +{count}₴
                        </button>
                        <button className="save-button" onClick={saveToBalance}>
                            💾 Зберегти зароблене
                        </button>
                    </div>
                </>
            ) : (
                <p>Перенаправлення...</p>
            )}
        </div>
    );
}
