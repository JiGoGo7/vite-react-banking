const { Schema, model, Types } = require("mongoose");

const Credit = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    job: { type: Boolean, required: true },
    maritalStatus: { type: Boolean, required: true },
    income: { type: Number, required: true },
    expenses: { type: Number, required: true },
    requestedAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Paid'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('Credit', Credit);