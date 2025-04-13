const { Schema, model } = require('mongoose');

const User = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, unique: false, required: true },
    role: { type: String, default: 'User' },
    balance: { type: Number, default: 0 },
});

module.exports = model('User', User);
