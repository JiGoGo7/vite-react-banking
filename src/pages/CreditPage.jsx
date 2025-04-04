import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCredit, payCredit, getApprovedCredit } from "../services/creditService";
import "../desifnFiles/creditPage.css";

const Credit = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [credit, setCredit] = useState(null);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [job, setJob] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState(false);
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserId(parsedUser.userId);
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      getApprovedCredit(user.username).then((credit) => {
        setCredit(credit || null);
      });
    }
  }, [user]);

  const handleCredit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerCredit({
        userId,
        fullName,
        age: Number(age),
        job,
        maritalStatus,
        income: Number(income),
        expenses: Number(expenses),
        requestedAmount: Number(requestedAmount),
      });

      if (response.ok) {
        setMessage("Запит на кредит відправлено!");
      } else {
        setMessage(response.message || "Помилка відправлення кредиту");
      }
    } catch (error) {
      alert("Помилка підключення до сервера");
    }
  };

  const handlePayCredit = async () => {
    if (!credit) return;
    try {
      const response = await payCredit(user.userId, credit._id);
      if (response.ok) {
        setMessage("Кредит успішно погашений!");
        setCredit(null);
      } else {
        setMessage(response.message || "Помилка при виплаті кредиту");
      }
    } catch (error) {
      alert("Помилка підключення до сервера");
    }
  };

  return (
    <div className="credit-container">
      {user ? (
        <>
          <h2 className="credit-title">🏦 Сторінка кредитування</h2>
          {credit ? (
            <div className="credit-card">
              <h4>Ваш активний кредит</h4>
              <p><strong>Сума:</strong> {credit.requestedAmount} грн</p>
              <p><strong>До сплати:</strong> {credit.requestedAmount * 1.1} грн</p>
              <button className="credit-btn" onClick={handlePayCredit}>Погасити кредит</button>
            </div>
          ) : (
            <form className="credit-form" onSubmit={handleCredit}>
              <h4>Заповніть форму, щоб подати заявку</h4>
              <input type="text" placeholder="Повне ім'я" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <input type="number" placeholder="Вік" value={age} onChange={(e) => setAge(e.target.value)} required />
              <label>
                Працевлаштований:
                <input type="checkbox" checked={job} onChange={(e) => setJob(e.target.checked)} />
              </label>
              <label>
                Одружений:
                <input type="checkbox" checked={maritalStatus} onChange={(e) => setMaritalStatus(e.target.checked)} />
              </label>
              <input type="number" placeholder="Дохід" value={income} onChange={(e) => setIncome(e.target.value)} required />
              <input type="number" placeholder="Витрати" value={expenses} onChange={(e) => setExpenses(e.target.value)} required />
              <input type="number" placeholder="Сума кредиту" value={requestedAmount} onChange={(e) => setRequestedAmount(e.target.value)} required />
              <button type="submit" className="credit-btn">Відправити</button>
            </form>
          )}
          {message && <p className="credit-message">{message}</p>}
        </>
      ) : (
        <p>Перенаправлення...</p>
      )}
    </div>
  );
};

export default Credit;
