const bcrypt = require("bcrypt");
const uuid  = require("uuid");
const { get, add, getById, updateById, deleteById } = require("../models/users");

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

exports.addUser = async (req,res) => {
  if (req.isAuthenticated() && req.user["is_admin"]) {
    // allow admin to add a user
    const { name, password, email, address } = req.body;
    const id = uuid.v4();

    try {
      // Hash password before storing in local DB:
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const addUserResponse = await add(id, name, hashedPassword, email, address);

      if (addUserResponse.rowCount===1) {
        return res.status(201).json({id, name, email, address});
      } else {
        return res.status(400).json({error:"Unable to add user account"});
      }
    } catch (error) {
      res.status(500).json({error});
    }
  } else {
    // do not allow non-admins to add a user
    return res.status(401).json();
  }
};

exports.getUserById = async (req,res) => {
  const id = req.params.userId;

  if (!uuid.validate(id))
    return res.status(400).json();

  if (req.isAuthenticated()) {
    if (req.user["is_admin"]){
      // show any user to an admin
      try {
        const response = await getById(id);
        return res.status(200).json(response.rows[0]);
      } catch (error) {
        return res.status(400).json({error});
      }
    } else {
      // show only a user's own profile to non-admin users
      if (id===req.user.id) {
        return res.status(200).json(req.user);
      } else {
        return res.status(403).json();
      }
    }
  } else {
    // show nothing to unauthenticated users
    return res.status(401).json();
  }
};

exports.updateUserById = async (req,res) => {

  const id = req.params.userId;
  const { name, email, address } = req.body;

  if (!uuid.validate(id))
    return res.status(400).json();

  if (req.isAuthenticated()) {
    if (req.user["is_admin"] || id===req.user.id){
      // show any user to an admin
      try {
        const updateUserResponse = await updateById(id, name, email, address);

        if (updateUserResponse.rowCount===1) {
          return res.status(200).json({message:"Successfully updated"});
        } else {
          return res.status(400).json({error:"Unable to update user"});
        }
      } catch (error) {
        return res.status(400).json({error});
      }
    } else {
      return res.status(403).json();
    }
  } else {
    // show nothing to unauthenticated users
    return res.status(401).json();
  }
};

exports.deleteUserById = async (req,res) => {

  const id = req.params.userId;

  if (!uuid.validate(id))
    return res.status(400).json();

  if (req.isAuthenticated()) {
    if (req.user["is_admin"]) {
      try {
        const deleteUserResponse = await deleteById(id);

        if (deleteUserResponse.rowCount===1) {
          return res.status(204).send("Account Successfully deleted");
        } else {
          return res.status(400).json({error:"Unable to add user account"});
        }
      } catch (error) {
        res.status(500).json({error});
      }
    } else {
      return res.status(403).json();
    }
  } else {
    // do not allow non-admins to add a user
    return res.status(401).json();
  }
};
