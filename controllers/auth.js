const {v4 : uuidv4} = require("uuid");
const { register, login } = require("../models/auth")
const passport = require("passport");
const bcrypt = require("bcrypt");


exports.authRegisterUser =  async (req, res) => {
  const { name, password, email, address } = req.body;
  const id = uuidv4();

  try {

    // Hash password before storing in local DB:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const registerResponse = await register(id, name, hashedPassword, email, address);

    if (registerResponse.rowCount===1) {
      return res.status(201).json({id, name, email, address});
    } else {
      return res.status(400).json({error:"Unable to create user account"});
    }
  } catch (error) {
    res.status(500).json({error});
  }
};

exports.authLogin = passport.authenticate("local");

exports.authLoginSuccess = async (req, res) => {
  res.status(200).json( {
    message: "successful login",
    userId: req.user.id,
    success: true,
  } );
};

exports.authLogout = async (req, res) => {

  if (req.isAuthenticated()) {
    req.logout(function(err) {
    if (err) { return res.status(400).json(err); }
      return res.status(200).json({
        message:"Logout operation was successful",
        success: true,
      });
    });
  } else {
    res.status(401).json({
      message:"Must be logged in, in order to log out",
    });
  }

};