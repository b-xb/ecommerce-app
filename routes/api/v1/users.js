const express = require('express');
const router = express.Router();

const { getUsers, addUser, getUserById, updateUserById, deleteUserById} = require("../../../controllers/users");

router.get('/', getUsers);
router.post('/', addUser);
router.get('/:userId', getUserById);
router.put('/:userId', updateUserById);
router.delete('/:userId', deleteUserById);

module.exports = router;