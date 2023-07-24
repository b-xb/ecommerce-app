const express = require('express');
const router = express.Router();

const { getUsers, addUser, getUserById, updateUserById, deleteUserById} = require("../../../controllers/users");
const { getOrdersByUser, addOrderByUser, deleteAllOrdersByUser } = require("../../../controllers/orders");
const { getCartItemsByUser, deleteAllCartItemsByUser, addCartItemByUserAndProduct, updateCartItemByUserAndProduct, deleteCartItemByUserAndProduct } = require("../../../controllers/cartItems");

router.get('/', getUsers);
router.post('/', addUser);
router.get('/:userId', getUserById);
router.put('/:userId', updateUserById);
router.delete('/:userId', deleteUserById);
router.get('/:userId/cart-items', getCartItemsByUser);
router.delete('/:userId/cart-items', deleteAllCartItemsByUser);
router.post('/:userId/cart-items/:productId', addCartItemByUserAndProduct);
router.put('/:userId/cart-items/:productId', updateCartItemByUserAndProduct);
router.delete('/:userId/cart-items/:productId', deleteCartItemByUserAndProduct);
router.get('/:userId/orders', getOrdersByUser);
router.post('/:userId/orders', addOrderByUser);
router.delete('/:userId/orders', deleteAllOrdersByUser);

module.exports = router;