const express = require('express');
const router = express.Router();

const { getUsers, addUser, deleteAllUsers, getUserById, updateUserById, deleteUserById} = require("../../../controllers/users");

router.get('/', getUsers);
router.post('/', addUser);
router.delete('/', deleteAllUsers);
router.get('/:userId', getUserById);
router.put('/:userId', updateUserById);
router.delete('/:userId', deleteUserById);

module.exports = router;