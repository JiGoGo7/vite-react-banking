import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { getCredits, approveCredit, rejectCredit, fetchRisk } from "../services/creditService";

const Admin = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [credits, setCredits] = useState([]);
  const [message, setMessage] = useState("");
  const [risk, setRisk] = useState(null);

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
        const scores = await fetchRisk(creditIds);

        const riskMap = creditIds.reduce((acc, id, index) => {
          acc[id] = scores[index];
          return acc;
      }, {});
      
      setRisk(riskMap);
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
    const response = await approveCredit(id);
    if (response.message) {
      setMessage(response.message);
      setCredits(credits.filter(credit => credit._id !== id));
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
      {credits.length === 0 ? <p>Завантаження...</p> : (
        credits.length > 0 ? (
          <ul>
            {credits.map((credit) => (
              <li key={credit._id}>
                <p><b>Користувач:</b> {credit.fullName}</p>
                <p><b>Запитана сума:</b> {credit.requestedAmount} грн</p>
                <p><b>Кредитний рейтинг користувача:</b> {risk ? risk[credit._id] ?? "Немає даних" : "Завантаження..."}</p>
                <button onClick={() => handleApprove(credit._id)}>Схвалити</button>
                <button onClick={() => handleReject(credit._id)}>Відхилити</button>
              </li>
            ))}
          </ul>
      ) : <p>Немає заявок на розгляд</p> 
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Admin;
