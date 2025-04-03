import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCredits, approveCredit, rejectCredit, fetchRating } from "../services/creditService";
import { updateUserBalance } from '../services/balanceService';
import { findUserById } from "../services/otherService";

const Admin = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [credits, setCredits] = useState([]);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
        const parsedUser = JSON.parse(storedUser)
        setRole(parsedUser.role)
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
      console.log(credit.userId)
      const user = await findUserById(credit.userId);
      if (!user) {
        setMessage("Користувач не знайдений");
        return;
      }
  
      console.log("userId:", user._id, "newBalance:", credit.requestedAmount);
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
    <div>
      <button onClick={() => navigate("/")}>Головна</button>
      <h2>Панель адміністратора</h2>
      <h4>Список заявок на кредит</h4>
      {credits.length === 0 ? <p>Немає кредитів на розгляд</p> : (
        credits.length > 0 ? (
          <ul>
            {credits
            .filter(credit => credit.status === "Pending")
            .map((credit) => (
              <li key={credit._id}>
                <p><b>Користувач:</b> {credit.fullName}</p>
                <p><b>Вік</b> {credit.age}</p>
                <p><b>Одружений:</b> {credit.maritalStatus ? "Так" : "Ні"}</p>
                <p><b>Влаштований на роботу:</b> {credit.job ? "Так" : "Ні"}</p>
                <p><b>Заробітня плата:</b> {credit.income}₴</p>
                <p><b>Місячні витрати</b> {credit.expenses}₴</p>
                <p><b>Запитана сума:</b> {credit.requestedAmount}₴</p>
                <p><b>Кредитний рейтинг користувача:</b> {rating ? rating[credit._id] ?? "Немає даних" : "Завантаження..."}</p>
                <button onClick={() => handleApprove(credit._id)}>Схвалити</button>
                <button onClick={() => handleReject(credit._id)}>Відхилити</button>
              </li>
            ))}
          </ul>
      ) : <p>Завантаження...</p> 
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Admin;
