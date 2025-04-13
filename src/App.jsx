import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/NavBar';
import Earnings from './pages/EarningPage';
import AboutUs from './pages/AboutPage';
import Transfer from './pages/TransferPage';
import Main from './pages/MainPage';
import Register from './pages/RegisterPage';
import Login from './pages/LoginPage';
import Admin from './pages/AdminPage';
import Credit from './pages/CreditPage';
import CreditHistory from './pages/CreditHistoryPage';

function App() {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.removeItem('user');
        }
    }, []);

    return (
        <Router>
            <AppContent />
        </Router>
    );
}

function AppContent() {
    const location = useLocation();
    const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            {!hideNavbar && <Navbar />}
            <div className="content-container">
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Main />} />
                    <Route path="/earnings" element={<Earnings />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/transfer" element={<Transfer />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/credit" element={<Credit />} />
                    <Route path="/creditHistory" element={<CreditHistory />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
