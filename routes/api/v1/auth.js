const express = require('express');
const router = express.Router();

const { authRegisterUser, authLogin, authLoginSuccess, authLogout } = require("../../../controllers/auth");

router.post('/register', authRegisterUser);

router.post("/login", authLogin, authLoginSuccess);

router.post("/logout", authLogout);

module.exports = router;
