const Router = require('express');
const router = new Router();
const controller = require('../controllers/creditController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post(
    '/credit',
    [
        check('fullName', "Повне ім'я обов'язкове").notEmpty(),
        check('age', 'Вік повинен бути числом').isNumeric(),
        check('income', 'Дохід повинен бути числом').isNumeric(),
        check('requestedAmount', 'Сума кредиту повинна бути числом').isNumeric(),
    ],
    controller.credit,
);

router.post(
    '/risk',
    [
        check('income', 'Дохід повинен бути числом').isNumeric(),
        check('expenses', 'Витрати повинні бути числом').isNumeric(),
        check('age', 'Вік повинен бути числом').isNumeric(),
        check('maritalStatus', 'Сімейний статус повинен бути булевим значенням').isBoolean(),
        check('job', 'Наявність роботи повинна бути булевим значенням').isBoolean(),
    ],
    controller.creditRisk
);

router.get('/getCredits', controller.getCredits);
router.patch('/:id/status', controller.creditStatus);
router.post('/approve/:id', authMiddleware, roleMiddleware(['Admin', 'employee']), controller.approveCredit);
router.post('/reject/:id', authMiddleware, roleMiddleware(['Admin', 'employee']), controller.rejectCredit);

module.exports = router;