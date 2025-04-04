import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPaidCredit } from "../services/creditService";
import '../desifnFiles/navBar.css'

const CreditHistory = () => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    const fetchCredits = async () => {
      const data = await getPaidCredit();
      setCredits(data);
    };
  
    fetchCredits();
  }, [navigate]);


  return (
    <div>
      <h2>Панель адміністратора</h2>
      <h4>Список заявок на кредит</h4>
      {credits.length === 0 ? <p>Немає кредитів на розгляд</p> : (
        credits.length > 0 ? (
          <ul>
            {credits
            .map((credit) => (
              <li key={credit._id}>
                <p><b>Користувач:</b> {credit.fullName}</p>
                <p><b>Вік</b> {credit.age}</p>
                <p><b>Одружений:</b> {credit.maritalStatus ? "Так" : "Ні"}</p>
                <p><b>Влаштований на роботу:</b> {credit.job ? "Так" : "Ні"}</p>
                <p><b>Заробітня плата:</b> {credit.income}₴</p>
                <p><b>Місячні витрати</b> {credit.expenses}₴</p>
                <p><b>Запитана сума:</b> {credit.requestedAmount}₴</p>
              </li>
            ))}
          </ul>
      ) : <p>Завантаження...</p> 
      )}
    </div>
  );
};

export default CreditHistory;
