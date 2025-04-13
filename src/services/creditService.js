const API_URL = 'http://localhost:7070/credits';

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
export const getCredits = async () => {
    try {
        const response = await fetch(`${API_URL}/getCredits`);
        return await response.json();
    } catch (error) {
        console.error('Помилка отримання кредитів:', error);
        return [];
    }
};

export const approveCredit = async (creditId) => {
    try {
        const response = await fetch(`${API_URL}/approve/${creditId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Помилка схвалення кредиту:', error);
    }
};

export const rejectCredit = async (creditId) => {
    try {
        const response = await fetch(`${API_URL}/reject/${creditId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Помилка відхилення кредиту:', error);
    }
};

export const fetchRating = async (creditIds) => {
    try {
        console.log(creditIds);
        const response = await fetch(`${API_URL}/rating`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creditIds }),
        });

        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }

        const ratingData = await response.json();
        console.log('Оцінка ризику:', ratingData);
        return ratingData.ratingScores;
    } catch (error) {
        console.error('Помилка при отриманні ризику:', error);
    }
};

export const getCredit = async (username) => {
    const response = await fetch(`${API_URL}/getCredit`, {
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

export const payCredit = async (userId, creditId) => {
    const response = await fetch(`${API_URL}/payCredit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, creditId }),
    });

    return await response.json();
};

export const getApprovedCredit = async (username) => {
    const response = await fetch(`${API_URL}/getApprovedCredit`, {
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

export const getPaidCredit = async (username) => {
    const response = await fetch(`${API_URL}/getPaidCredit`, {
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
