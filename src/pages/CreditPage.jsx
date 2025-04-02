import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { registerCredit } from "../services/creditService";

const Credit = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("")
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
      setUser(JSON.parse(storedUser));
    }
    const parsedUser = JSON.parse(storedUser)
    setUserId(parsedUser.userId)
  }, [navigate]);

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
              requestedAmount: Number(requestedAmount)});
              
              if (response.message) setMessage(response.message);
                            
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

  return (
    <div>
      {user ? (
        <>
          <button onClick={() => { navigate("/") }}>Головна</button>
          <button onClick={() => { navigate("/aboutUs"); }}>Про нас</button>
          <button onClick={() => { navigate("/earnings") }}>Заробіток</button>
          <button onClick={() => { navigate("/transfer") }}>Переказ</button>
          <button onClick={() => { logoutUser(); navigate("/login"); }}>Вийти</button>
          <form onSubmit={handleCredit}>
            <input
            type="text"
            placeholder="Повне ім'я"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required />
            <input
            type="number"
            placeholder="Вік"
            value={age} onChange={(e) => setAge(e.target.value)}
            required />
            <label>
              Працевлаштований:
              <input
              type="checkbox"
              checked={job}
              onChange={(e) => setJob(e.target.checked)} />
            </label>
            <label>
              Одружений:
              <input 
              type="checkbox" 
              checked={maritalStatus} 
              onChange={(e) => setMaritalStatus(e.target.checked)} />
            </label>
            <input 
            type="number" 
            placeholder="Місячний дохід" 
            value={income} 
            onChange={(e) => setIncome(e.target.value)} 
            required />
            <input 
            type="number" 
            placeholder="Місячні витрати" 
            value={expenses} 
            onChange={(e) => setExpenses(e.target.value)} 
            required />
            <input 
            type="number" 
            placeholder="Сума кредиту" 
            value={requestedAmount} 
            onChange={(e) => setRequestedAmount(e.target.value)} 
            required />
            <button type="submit">Відправити запит</button>
          </form>
          {message && <p>{message}</p>}
          </>
      ) : (
        <p>Перенаправлення...</p>
      )}
      
    </div>
  );
};

export default Credit;
