const express = require('express');
const router = express.Router();

const { authRegisterUser, authLogin, authLoginSuccess } = require("../../../controllers/auth");

router.post('/register', authRegisterUser);

router.post("/login", authLogin, authLoginSuccess);


module.exports = router;
