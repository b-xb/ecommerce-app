const express = require('express');
const router = express.Router();

const { getOrders, getOrderById, updateOrderById, deleteOrderById, getOrderStatusById, updateOrderStatusById} = require("../../../controllers/orders");
const { getOrderItemsByOrder, addOrderItemsByOrder, deleteAllOrderItemsByOrder, getOrderItemByOrderAndProduct, updateOrderItemByOrderAndProduct, deleteOrderItemByOrderAndProduct } = require("../../../controllers/orderItems");


router.get('/', getOrders);
router.get('/:orderId', getOrderById);
router.put('/:orderId', updateOrderById);
router.delete('/:orderId', deleteOrderById);
router.get('/:orderId/status', getOrderStatusById);
router.put('/:orderId/status', updateOrderStatusById);
router.get('/:orderId/items', getOrderItemsByOrder);
router.post('/:orderId/items', addOrderItemsByOrder);
router.delete('/:orderId/items', deleteAllOrderItemsByOrder);
router.get('/:orderId/items/:productId', getOrderItemByOrderAndProduct);
router.post('/:orderId/items/:productId', updateOrderItemByOrderAndProduct);
router.delete('/:orderId/items/:productId', deleteOrderItemByOrderAndProduct);


module.exports = router;