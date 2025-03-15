const API_URL = 'http://localhost:7070/auth';

export const registerUser = async (username, password) => {
    const response = await fetch(`${API_URL}/registr`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) localStorage.setItem('user', JSON.stringify({ username }));

    const data = await response.json();
    return { ...data, ok: response.ok };
};

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) localStorage.setItem('user', JSON.stringify({ username }));
    const data = await response.json();
    return { ...data, ok: response.ok };
};

export const logoutUser = () => {
    localStorage.removeItem('username');
};
