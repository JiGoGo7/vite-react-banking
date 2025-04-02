require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const router = require('./router');
const PORT = process.env.PORT;
const cors = require("cors");
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use("/auth", router)

const start = async () => {
    try {
        await mongoose.connect(process.env.URL)
        app.listen(PORT, console.log(`Server started with a port ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start();