const API_URL = 'http://localhost:7070/auth';

export const registerUser = async (username, password) => {
    const response = await fetch(`${API_URL}/registr`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) localStorage.setItem('user', JSON.stringify({ username, userId: data.userId, role:data.role }));

    return { ...data, ok: response.ok };
};

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('user', JSON.stringify({ username, userId: data.userId, role: data.role }));
        localStorage.setItem('token', data.token);
    }

    return { ...data, ok: response.ok };
};

export const logoutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token')
};
