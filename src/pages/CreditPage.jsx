import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { registerCredit, payCredit, getApprovedCredit } from "../services/creditService";

const Credit = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [credit, setCredit] = useState(null);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState(0);
  const [job, setJob] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState(false);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [requestedAmount, setRequestedAmount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserId(parsedUser.userId);
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      getApprovedCredit(user.username).then((credit) => {
        if (credit) {
          setCredit(credit);
        } else {
          setCredit(null);
        }
        console.log(credit)
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
      console.error("Помилка запиту:", error);
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
      console.error("Помилка виплати кредиту:", error);
      alert("Помилка підключення до сервера");
    }
  };

  return (
    <div>
      {user ? (
        <>
          <button onClick={() => navigate("/")}>Головна</button>
          <button onClick={() => navigate("/aboutUs")}>Про нас</button>
          <button onClick={() => navigate("/earnings")}>Заробіток</button>
          <button onClick={() => navigate("/transfer")}>Переказ</button>
          <button onClick={() => { logoutUser(); navigate("/login"); }}>Вийти</button>
          <h2>Сторінка кредитів</h2>
          {credit ? (
            <div>
              <h4>Ваш поточний кредит</h4>
              <p><b>Сума кредиту:</b> {credit.requestedAmount} грн</p>
              <p><b>Сума до сплати:</b> {credit.requestedAmount * 1.1} грн</p>
              <button onClick={handlePayCredit}>Сплатити кредит</button>
            </div>
          ) : (
            <>
              <h4>Заповніть форму, щоб взяти кредит</h4>
              <form onSubmit={handleCredit}>
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
                <input type="number" placeholder="Місячний дохід" value={income} onChange={(e) => setIncome(e.target.value)} required />
                <input type="number" placeholder="Місячні витрати" value={expenses} onChange={(e) => setExpenses(e.target.value)} required />
                <input type="number" placeholder="Сума кредиту" value={requestedAmount} onChange={(e) => setRequestedAmount(e.target.value)} required />
                <button type="submit">Відправити запит</button>
              </form>
            </>
          )}
          {message && <p>{message}</p>}
        </>
      ) : (
        <p>Перенаправлення...</p>
      )}
    </div>
  );
};

export default Credit;
