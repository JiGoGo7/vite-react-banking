const Credit = require('../models/creditModel');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

class CreditController {
    async credit(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: `Помилка: `,
                    errors: errors.array().map((err) => err.msg),
                });
            }

            const { userId, fullName, income, expenses, requestedAmount, age, job, maritalStatus } = req.body;

            const existingCredit = await Credit.findOne({ userId, status: { $in: ['Pending', 'Approved'] } });

            if (existingCredit) {
                return res.status(400).json({ message: 'Ви вже відправили запит на кредит.' });
            }

            const credit = new Credit({
                userId,
                fullName,
                income,
                expenses,
                requestedAmount,
                status: 'Pending',
                creditDate: new Date(),
                age,
                job,
                maritalStatus,
            });

            await credit.save();
            return res.json({ message: 'Запит на кредит відправлено!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Credit request error' });
        }
    }

    async getCredits(req, res) {
        try {
            const credits = await Credit.find();
            res.json(credits);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error fetching credits' });
        }
    }

    async creditStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['Approved', 'Rejected'].includes(status)) {
                return res.status(400).json({ message: 'Невірний статус кредиту' });
            }

            const updatedCredit = await Credit.findByIdAndUpdate(id, { status }, { new: true });

            if (!updatedCredit) {
                return res.status(404).json({ message: 'Кредит не знайдено' });
            }

            res.json({ message: `Статус кредиту оновлено на ${status}`, updatedCredit });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error updating credit status' });
        }
    }

    static calculateRating(income, expenses, age, maritalStatus, job, requestedAmount) {
        let rating = 40;

        const expenseRatio = (expenses / income) * 100;
        if (expenseRatio > 50) rating += 20;
        if (expenseRatio > 70) rating += 30;

        if (age < 25) rating += 15;
        if (age > 55) rating += 10;

        if (maritalStatus === false) rating += 10;
        if (job === false) rating += 10;

        if (requestedAmount > income * 0.5) rating += 15;
        if (requestedAmount > income) rating += 30;

        return rating;
    }

    async creditRating(req, res) {
        try {
            const { creditIds } = req.body;

            if (!creditIds || !Array.isArray(creditIds) || creditIds.length === 0) {
                return res.status(400).json({ message: 'Невірні або відсутні ID кредитів' });
            }

            const credits = await Credit.find({ _id: { $in: creditIds } });

            if (credits.length === 0) {
                return res.status(404).json({ message: 'Кредити не знайдені' });
            }

            const ratingScores = credits.map((credit) =>
                CreditController.calculateRating(
                    credit.income,
                    credit.expenses,
                    credit.age,
                    credit.maritalStatus,
                    credit.job,
                    credit.requestedAmount,
                ),
            );

            res.json({ ratingScores });
        } catch (error) {
            console.error('Помилка при обробці запиту:', error);
            res.status(500).json({ message: 'Помилка сервера' });
        }
    }

    async approveCredit(req, res) {
        try {
            const creditId = req.params.id;
            const credit = await Credit.findById(creditId);

            if (!credit) {
                return res.status(404).json({ message: 'Кредит не знайдено' });
            }

            if (credit.status !== 'Pending') {
                return res.status(400).json({ message: 'Кредит вже оброблений' });
            }

            credit.status = 'Approved';
            await credit.save();

            return res.json({ message: 'Кредит схвалено!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Помилка під час схвалення кредиту' });
        }
    }

    async rejectCredit(req, res) {
        try {
            const creditId = req.params.id;
            const credit = await Credit.findById(creditId);

            if (!credit) {
                return res.status(404).json({ message: 'Кредит не знайдено' });
            }

            if (credit.status !== 'Pending') {
                return res.status(400).json({ message: 'Кредит вже оброблений' });
            }

            credit.status = 'Rejected';
            await credit.save();

            return res.json({ message: 'Кредит відхилено!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Помилка під час відхилення кредиту' });
        }
    }
    async getCredit(req, res) {
        try {
            const user = await User.findOne({ username: req.body.username });
            const credit = await Credit.findOne({ userId: user._id });
            res.json(credit);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Find credit error ', error });
        }
    }

    async getApprovedCredit(req, res) {
        try {
            const user = await User.findOne({ username: req.body.username });
            const credit = await Credit.findOne({ userId: user._id, status: 'Approved' });
            if (!credit) {
                return res.status(404).json({ message: 'No approved credit found' });
            }
            res.json(credit);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Find credit error ', error });
        }
    }

    async getPaidCredit(req, res) {
        try {
            const user = await User.findOne({ username: req.body.username });
            const credit = await Credit.find({ userId: user._id, status: 'Paid' });
            if (!credit) {
                return res.status(404).json({ message: 'No approved credit found' });
            }
            res.json(credit);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Find credit error ', error });
        }
    }

    async payCredit(req, res) {
        try {
            const { userId, creditId } = req.body;

            const credit = await Credit.findById(creditId);
            if (!credit) return res.status(400).json({ message: 'Кредит не знайдено' });

            if (credit.status === 'Paid') {
                return res.status(400).json({ message: 'Кредит уже сплачений' });
            }

            const user = await User.findById(userId);
            if (!user) return res.status(400).json({ message: 'Користувач не знайдений' });

            const amountToPay = credit.requestedAmount * 1.1;

            if (user.balance < amountToPay) {
                return res.status(400).json({ message: 'Недостатньо коштів на балансі' });
            }

            user.balance -= amountToPay;
            await user.save();

            credit.status = 'Paid';
            await credit.save();

            return res.json({
                message: 'Кредит успішно погашений!',
                balance: user.balance,
                creditStatus: credit.status,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Помилка виплати кредиту' });
        }
    }
}

module.exports = new CreditController();
