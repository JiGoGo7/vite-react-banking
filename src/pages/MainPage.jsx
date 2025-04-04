import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../desifnFiles/navBar.css"
import '../desifnFiles/mainPage.css';

const Main = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({ username: parsedUser.username, userId: parsedUser.userId, role: parsedUser.role });
    }
  }, [navigate]);

  return (
    <div className="main-container">
      <div className="content">
        <div className="profile-pic"></div>
        <div className="text">
          <h2>Вітаю, {user?.username}!</h2>
          <h3 className="slogan">Надійний банк для вашого фінансового зростання</h3>
          <p className="info-text">
            Ми допоможемо вам керувати фінансами, заробляти та отримувати кредити швидко й безпечно.
          </p>
          <button className="info-button" onClick={() => navigate("/aboutUs")}>Дізнатися більше</button>
        </div>
      </div>
    </div>
  );
};

export default Main;