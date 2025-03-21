import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Earnings from './pages/EarningPage';
import AboutUs from './pages/AboutPage';
import Transfer from './pages/TransferPage';
import Main from './pages/MainPage';
import Register from './pages/RegisterPage';
import Login from './pages/LoginPage';
import Admin from './pages/AdminPage';

function App() {
    const [count, setCount] = useState(0);
    
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
            </Routes>
        </Router>
        </>
    );
}

export default App;
