const API_URL = 'http://localhost:7070/auth';

export const updateUserBalance = async (username, newBalance) => {
    const response = await fetch(`${API_URL}/updateBalance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, newBalance }),
    });
  
    const data = await response.json();
    return data;
  };
  
  export const getUserBalance = async (username) => {
  const response = await fetch(`${API_URL}/getBalance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw new Error("Помилка отримання балансу");
  }

  const data = await response.json();
  return data;
};

export const findUser = async (username) => {
  const response = await fetch(`${API_URL}/findUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw new Error("Помилка отримання балансу");
  }
  
  const data = await response.json();
  return data;
};