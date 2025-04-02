const Credit = require("../models/creditModel");

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
                return res.status(400).json({ message: 'У вас вже є активний кредит. Новий отримати неможливо.' });
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
                maritalStatus
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

   static calculateRisk(income, expenses, age, maritalStatus, job) {
        let risk = 50;
        
        const expenseRatio = (expenses / income) * 100;
        if (expenseRatio > 50) risk += 20;
        if (expenseRatio > 70) risk += 30;
        
        if (age < 25) risk += 15;
        if (age > 55) risk += 10;
        
        if (maritalStatus === false) risk += 10;
        if (job === false) risk += 10;
        
        return risk;
    }

    async creditRisk(req, res) {
        try {
            const { creditIds } = req.body;
    
            if (!creditIds || !Array.isArray(creditIds) || creditIds.length === 0) {
                return res.status(400).json({ message: "Невірні або відсутні ID кредитів" });
            }
    
            const credits = await Credit.find({ _id: { $in: creditIds } });
    
            if (credits.length === 0) {
                return res.status(404).json({ message: "Кредити не знайдені" });
            }
    
            const riskScores = credits.map(credit => 
                CreditController.calculateRisk(credit.income, credit.expenses, credit.age, credit.maritalStatus, credit.job)
            );
    
            res.json({ riskScores });
        } catch (error) {
            console.error("Помилка при обробці запиту:", error);
            res.status(500).json({ message: "Помилка сервера" });
        }
    };
    

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
}

module.exports = new CreditController();
