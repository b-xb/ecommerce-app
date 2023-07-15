const express = require('express');
const router = express.Router();

const { authRegisterUser, authLogin } = require("../../../controllers/auth");

router.post('/register', authRegisterUser);

router.post('/login', authLogin);

module.exports = router;
