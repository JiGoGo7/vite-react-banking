const User = require('./models/userModel');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

class controller {
    async registr(req, res) {
        try {
            const error = validationResult(req);

            if (!error.isEmpty())
                return res.status(400).json({
                    message: `Помилка: `,
                    error: error.array().map((err) => err.msg),
                });

            const { username, password, role } = req.body;
            const userExist = await User.findOne({ username });

            if (userExist) return res.status(400).json({ message: "Користувач з таким ім'ям уже існує" });

            const hashPassword = bcrypt.hashSync(password, 5);
            const user = new User({ username, password: hashPassword, role });
            await user.save();
            return res.json({ message: 'Користувач успішно зареєстрований' });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Registration error' });
        }
    }

    async login(req, res) {
        try {
            const { username, password, role } = req.body;
            const user = await User.findOne({ username });

            if (!user) return res.status(400).json({ message: 'Такого користувача не існує' });

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) return res.status(400).json({ message: 'Неправильний пароль' });

            return res.json({ message: `Ви ввійшли у свій обліковий запис, ${username}, роль: ${user.role}` });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Login error' });
        }
    }
    async updateBalance(req, res) {
        try {
            const { username, newBalance } = req.body;
            const user = await User.findOneAndUpdate(
                {username},
                {balance: newBalance},
                {new: true}
            )
            
            if(!user)return res.status(400).json({message: 'Користувач не знайдений'})
                
                return res.json({message: 'Ви успішно поповнили баланс!', balance: user.balance})            
            } catch (error) {
                console.log(error)
                return res.status(400).json({message: 'Помилка оновлення балансу'})
            }
            
        }
        async getBalance(req, res) {
            try {
                const { username } = req.body;
                
                if (!username) {
                    return res.status(400).json({ message: 'Username не надано' });
                }
                
                const user = await User.findOne({ username });
                
                if (!user) {
                    return res.status(400).json({ message: 'Користувач не знайдений' });
                }
                
                return res.json({ balance: user.balance });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Помилка отримання балансу' });
            }
        }
        
        async findUser(req, res) {
            try {
                const user = await User.findOne({username: req.body.username});
                if (!user) return res.status(400).json({message: "Користувача не знайдено"})
                res.json(user);
            } catch (error) {
                console.log(error);
                res.status(400).json({ message: 'Find user error ', error});
            }
        }
        async getRole(req, res) {
            try {
                const user = await User.findOne({username: req.body.username});
                if (!user) return res.status(400).json({message: "Користувача не знайдено"})
                res.json({role: user.role});
            } catch (error) {
                console.log(error);
                res.status(400).json({ message: 'Find role error ', error});
            }
        }
}

module.exports = new controller();
