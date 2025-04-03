import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from '../services/authService';
import { getUserBalance } from '../services/balanceService';
import { getCredit } from "../services/creditService";

const Main = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser({ username: parsedUser.username, userId: parsedUser.userId, role: parsedUser.role });

      getUserBalance(parsedUser.username).then(res => {
        setBalance(res.balance);
      });
      setRole(parsedUser.role)
    }
  }, [navigate]);

  return (
    <div>
      {user ? (
        <>
          <button onClick={() => { navigate("/aboutus") }}>Про нас</button>
          <button onClick={() => { navigate("/earnings") }}>Заробіток</button>
          <button onClick={() => { navigate("/transfer") }}>Переказ</button>
          <button onClick={() => { navigate("/credit") }}>Кредит</button>
          <button onClick={() => { logoutUser(); navigate("/login"); }}>Вийти</button>
          <h2>Вітаю, {user.username}!</h2>
          <h3>Ваш баланс: {balance}₴</h3>
        </>
      ) : (
        <p>Перенаправлення...</p>
      )}
      {role === 'Admin' && (
        <button onClick={() => {navigate('/admin')}}>Кнопка адміністратора</button>  
      )}
    </div>
  );
};

export default Main;
