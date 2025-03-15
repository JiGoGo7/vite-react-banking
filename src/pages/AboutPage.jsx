import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

const AboutUs = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
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
      
    </div>
  );
};

export default AboutUs;
