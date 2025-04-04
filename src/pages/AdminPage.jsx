import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCredits, approveCredit, rejectCredit, fetchRating } from "../services/creditService";
import { updateUserBalance } from '../services/balanceService';
import { findUserById } from "../services/otherService";
import "../desifnFiles/adminPage.css";

const Admin = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [credits, setCredits] = useState([]);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setRole(parsedUser.role);
    }

    const fetchCredits = async () => {
      const data = await getCredits();
      setCredits(data);

      if (data.length > 0) {
        const creditIds = data.map(credit => credit._id);
        const scores = await fetchRating(creditIds);

        const ratingMap = creditIds.reduce((acc, id, index) => {
          acc[id] = scores[index];
          return acc;
        }, {});

        setRating(ratingMap);
      }
    };

    fetchCredits();
  }, [navigate]);

  useEffect(() => {
    if (role === "User") {
      navigate("/");
    }
  }, [role, navigate]);

  const handleApprove = async (id) => {
    const credit = credits.find(credit => credit._id === id);
    const response = await approveCredit(id);
    if (response.message) {
      setMessage(response.message);
      setCredits(credits.filter(credit => credit._id !== id));
      const user = await findUserById(credit.userId);
      if (!user) {
        setMessage("Користувач не знайдений");
        return;
      }

      await updateUserBalance(user._id, credit.requestedAmount);
    }
  };

  const handleReject = async (id) => {
    const response = await rejectCredit(id);
    if (response.message) {
      setMessage(response.message);
      setCredits(credits.filter(credit => credit._id !== id));
    }
  };

  return (
    <div className="admin-container">
      <h2>Панель адміністратора</h2>
      <h4>Список заявок на кредит</h4>
      {credits.length === 0 ? <p>Немає кредитів на розгляд</p> : (
        <div className="credits-list">
          {credits
            .filter(credit => credit.status === "Pending")
            .map((credit) => (
              <div key={credit._id} className="credit-card">
                <p><span className="credit-label">Користувач:</span> {credit.fullName}</p>
                <p><span className="credit-label">Вік:</span> {credit.age}</p>
                <p><span className="credit-label">Одружений:</span> {credit.maritalStatus ? "Так" : "Ні"}</p>
                <p><span className="credit-label">Влаштований на роботу:</span> {credit.job ? "Так" : "Ні"}</p>
                <p><span className="credit-label">Заробітня плата:</span> {credit.income}₴</p>
                <p><span className="credit-label">Місячні витрати:</span> {credit.expenses}₴</p>
                <p><span className="credit-label">Запитана сума:</span> {credit.requestedAmount}₴</p>
                <p><span className="credit-label">Кредитний рейтинг користувача:</span> {rating ? rating[credit._id] ?? "Немає даних" : "Завантаження..."}</p>
                <div className="credit-actions">
                  <button className="approve-btn" onClick={() => handleApprove(credit._id)}>Схвалити</button>
                  <button className="reject-btn" onClick={() => handleReject(credit._id)}>Відхилити</button>
                </div>
              </div>
            ))}
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Admin;
