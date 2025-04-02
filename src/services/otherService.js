const API_URL = 'http://localhost:7070/auth';

export const findUser = async (username) => {
    const response = await fetch(`${API_URL}/findUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
  
    if (!response.ok) {
      throw new Error("Помилка пошуку користувача");
    }
    
    const data = await response.json();
    return data;
  };
  
  const getToken = () => localStorage.getItem('token');

  export const getRole = async (username) => {
    const response = await fetch(`${API_URL}/getRole`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify({ username }),
    });
  
    if (!response.ok) {
      throw new Error("Помилка пошуку ролі");
    }
    
    const data = await response.json();
    return data.role;
  };