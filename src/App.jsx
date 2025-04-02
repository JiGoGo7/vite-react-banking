import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Earnings from './pages/EarningPage';
import AboutUs from './pages/AboutPage';
import Transfer from './pages/TransferPage';
import Main from './pages/MainPage';
import Register from './pages/RegisterPage';
import Login from './pages/LoginPage';
import Admin from './pages/AdminPage';
import Credit from './pages/CreditPage';
import { useEffect } from "react";


function App() {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.removeItem('user');
        }
    }, []);
    
    return (
        <>
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Main />}></Route>
                <Route path = '/earnings' element = {<Earnings />}/>
                <Route path = '/aboutus' element = {<AboutUs />}/>
                <Route path = '/transfer' element = {<Transfer />}/>
                <Route path = '/admin' element = {<Admin />}/>
                <Route path = '/credit' element = {<Credit />}/>
            </Routes>
        </Router>
        </>
    );
}

export default App;
