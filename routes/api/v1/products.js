const express = require('express');
const router = express.Router();

const { getProducts, addProduct, getProductById, updateProductById, deleteProductById} = require("../../../controllers/products");

router.get('/', getProducts);
router.post('/', addProduct);
router.get('/:productId', getProductById);
router.put('/:productId', updateProductById);
router.delete('/:productId', deleteProductById);

module.exports = router;