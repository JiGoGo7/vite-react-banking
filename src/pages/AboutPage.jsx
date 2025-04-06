import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../desifnFiles/aboutPage.css";
import "../desifnFiles/navBar.css";
import Component from "../components/Component";

const AboutUs = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  return (
    <div>
      {user ? (
        <div className="about-container">
          <Component />
          <h1>Ласкаво просимо до банки Євгена!</h1>
          <p className="about-text">
            Ми створені для вашої фінансової свободи. Переказуйте гроші, заробляйте та отримуйте кредити – легко та швидко.
          </p>
          <div className="features">
            <div className="feature-card" onClick={() => navigate("/transfer")}>
              <h2>🔃 Перекази</h2>
              <p>Швидкі, безпечні та зручні перекази між користувачами.</p>
            </div>
            <div className="feature-card" onClick={() => navigate("/earnings")}>
              <h2>💰 Заробіток</h2>
              <p>Збільшуйте свій баланс, виконуючи завдання та отримуючи бонуси.</p>
            </div>
            <div className="feature-card" onClick={() => navigate("/credit")}>
              <h2>🏦 Кредити</h2>
              <p>Отримуйте миттєві кредити з гнучкими умовами повернення.</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Перенаправлення...</p>
      )}
    </div>
  );
};

export default AboutUs;
