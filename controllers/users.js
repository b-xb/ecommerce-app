const { get } = require("../models/users");

exports.getUsers = async (req, res) => {

  if (req.isAuthenticated()) {
    if (req.user["is_admin"]){
      // show all users to an admin
      try {
        const response = await get();
        return res.status(200).json(response.rows);
      } catch (error) {
        return res.status(400).json({error});
      }
    } else {
      // show only a user's own profile to non-admins
      return res.status(200).json([req.user]);
    }
  } else {
    // show nothing
    return res.status(401).json();
  }

};

exports.addUser = async (req,res) => { return res.json(); };
exports.deleteAllUsers = async (req,res) => { return res.json(); };
exports.getUserById = async (req,res) => { return res.json(); };
exports.updateUserById = async (req,res) => { return res.json(); };
exports.deleteUserById = async (req,res) => { return res.json(); };
