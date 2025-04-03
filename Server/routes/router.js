const Router = require('express');
const router = new Router();
const controller = require('../controllers/controller');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
    '/registr',
    [
        check('username', "Ім'я користувача не може бути коротше, ніж 4 символи або більший, ніж 15 символів").isLength(
            { min: 4, max: 15 },
        ),
        check('password', 'Пароль не може бути коротше, ніж 4 символи').isLength({ min: 4 }),
    ],
    controller.registr,
);

router.post('/login', controller.login);
router.post('/findUser', controller.findUser);
router.post('/getBalance', controller.getBalance);
router.post('/updateBalance', controller.updateBalance);
router.post('/findUserById', controller.findUserById);

module.exports = router;
