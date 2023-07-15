const {v4 : uuidv4} = require("uuid");
const { register, login } = require("../models/auth")

exports.authRegisterUser = async (req, res) => {
  const { name, password, email, address } = req.body;
  const id = uuidv4();

  try {
    const registerResponse = await register(id, name, password, email, address);

    if (registerResponse.rowCount===1) {
      return res.status(201).json({...req.body,id});
    } else {
      return res.status(400).json({error:"Unable to create user account"});
    }

  } catch (error) {
    res.status(400).json({error});
  }
}

exports.authLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const loginResponse = await login(email, password);

    if (loginResponse.rowCount===1) {
      res.status(200).json( loginResponse.rows[0] );
    } else {
      res.status(404).json({error:"User Account Not Found"});
    }
  } catch (error) {
    res.status(400).json({error});
  }
}
