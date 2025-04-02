const API_URL = 'http://localhost:7070/auth';

export const registerCredit = async (creditData) => {
    const response = await fetch(`${API_URL}/credit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creditData),
    });
  
    const data = await response.json();
    return { ...data, ok: response.ok };
  };