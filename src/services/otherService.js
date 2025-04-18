const API_URL = 'http://localhost:7070/auth';

export const findUser = async (username) => {
    const response = await fetch(`${API_URL}/findUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    });

    if (!response.ok) {
        throw new Error('Помилка пошуку користувача');
    }

    const data = await response.json();
    return data;
};

export const findUserById = async (userId) => {
    const response = await fetch(`${API_URL}/findUserById`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        throw new Error('Помилка пошуку користувача');
    }

    const data = await response.json();
    return data;
};
