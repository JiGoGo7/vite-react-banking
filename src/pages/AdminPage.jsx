import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { getRole } from "../services/otherService";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
        const parsedUser = JSON.parse(storedUser)
        setUser(JSON.parse(storedUser));
        getRole(parsedUser.username).then(role => {
              setRole(prev => ({ ...prev, role }));
            });
    }
  }, [navigate]);

  return (
    <div>
      {user ? (
        <>
          <button onClick={() => {navigate("/")}}>Головна</button>
          <button onClick={() => {navigate("/earnings")}}>Заробіток</button>
          <button onClick={() => {navigate("/transfer")}}>Переказ</button>
          <button onClick={() => { logoutUser(); navigate("/login"); }}>Вийти</button>
          <h2>Про нас</h2>
            <h4>Найнадійніший банк із усіх існуючих. Миттєві перекази коштів навіть на Марс! Єдина валюта! Ви точно не пошкодмуєте про рішення користуватися нашим банком!!!!!</h4>
        </>
      ) : (
        <p>Перенаправлення...</p>
      )}
      {role?.role === "User" && (
        navigate('/')
      )}
    </div>
  );
};

export default Admin;
