const router = require('express').Router();

const { createUser } = require('../controllers/users');
const { createUserValidation } = require('../middlewares/validation');

router.post('/', createUserValidation, createUser);

module.exports = router;
