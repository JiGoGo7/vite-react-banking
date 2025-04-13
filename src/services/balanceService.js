const API_URL = 'http://localhost:7070/auth';

export const updateUserBalance = async (userId, newBalance) => {
    const response = await fetch(`${API_URL}/updateBalance`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newBalance }),
    });
    console.log(userId, newBalance);
    const data = await response.json();
    return data;
};

const getToken = () => localStorage.getItem('token');

export const getUserBalance = async (username) => {
    const response = await fetch(`${API_URL}/getBalance`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ username }),
    });

    if (!response.ok) {
        throw new Error('Помилка отримання балансу');
    }

    const data = await response.json();
    return data;
};
