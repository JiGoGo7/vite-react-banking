const API_URL = 'http://localhost:7070';

export const registerCredit = async (creditData) => {
    const response = await fetch(`${API_URL}/credits/credit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creditData),
    });
  
    const data = await response.json();
    return { ...data, ok: response.ok };
  };
export const getCredits = async () => {
    try {
      const response = await fetch(`${API_URL}/credits/getCredits`);
      return await response.json();
    } catch (error) {
      console.error("Помилка отримання кредитів:", error);
      return [];
    }
  };
  
export const approveCredit = async (creditId) => {
    try {
      const response = await fetch(`${API_URL}/credits/approve/${creditId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Помилка схвалення кредиту:", error);
    }
  };
  
export const rejectCredit = async (creditId) => {
    try {
      const response = await fetch(`${API_URL}/credits/reject/${creditId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Помилка відхилення кредиту:", error);
    }
  };

export const fetchRisk = async (creditIds) => {
    try {
        console.log(creditIds)
        const response = await fetch(`${API_URL}/credits/risk`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ creditIds })
        });

        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }

        const riskData = await response.json();
        console.log("Оцінка ризику:", riskData);
        return riskData.riskScores;
    } catch (error) {
        console.error("Помилка при отриманні ризику:", error);
    }
};