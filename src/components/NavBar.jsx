import { useNavigate } from "react-router-dom";
import { logoutUser } from '../services/authService';
import { useState, useEffect } from "react";
import { getUserBalance } from "../services/balanceService";
import "../desifnFiles/mainPage.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate('/login')
    }
      else {
      const parsedUser = JSON.parse(storedUser);
      setRole(parsedUser.role);
        getUserBalance(parsedUser.username).then(res => {
          setBalance(res.balance);
        });
    }
  }, []);

  return (
    <div className="navbar">
      <div className="nav-left">
        <button onClick={() => navigate("/")} className="nav-button">Головна</button>
        <button onClick={() => navigate("/aboutUs")} className="nav-button">Про нас</button>
        <button onClick={() => navigate("/earnings")} className="nav-button">Заробіток</button>
        <button onClick={() => navigate("/transfer")} className="nav-button">Переказ</button>
        <button onClick={() => navigate("/credit")} className="nav-button">Кредит</button>
      </div>
      <div className="nav-right">
        {role === "Admin" && (
          <button onClick={() => navigate("/admin")} className="nav-button admin-button">Адмін-панель</button>
        )}
        <div className="balance-box">Баланс: {balance}₴</div>
        <button onClick={() => { logoutUser(); navigate("/login"); }} className="nav-button">Вийти</button>
      </div>
    </div>
  );
};

export default Navbar;