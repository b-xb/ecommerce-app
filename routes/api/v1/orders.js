const express = require('express');
const router = express.Router();

const { getOrders, getOrderById, deleteOrderById, getOrderStatusById, updateOrderStatusById} = require("../../../controllers/orders");
const { getOrderItemsByOrder, addOrderItemByOrderAndProduct, deleteAllOrderItemsByOrder, getOrderItemByOrderAndProduct, updateOrderItemByOrderAndProduct, deleteOrderItemByOrderAndProduct } = require("../../../controllers/orderItems");


router.get('/', getOrders);
router.get('/:orderId', getOrderById);
router.delete('/:orderId', deleteOrderById);
router.get('/:orderId/status', getOrderStatusById);
router.put('/:orderId/status', updateOrderStatusById);
router.get('/:orderId/items', getOrderItemsByOrder);
router.delete('/:orderId/items', deleteAllOrderItemsByOrder);
router.get('/:orderId/items/:productId', getOrderItemByOrderAndProduct);
router.post('/:orderId/items/:productId', addOrderItemByOrderAndProduct);
router.put('/:orderId/items/:productId', updateOrderItemByOrderAndProduct);
router.delete('/:orderId/items/:productId', deleteOrderItemByOrderAndProduct);


module.exports = router;