const uuid  = require("uuid");
const { getById } = require("../models/orders");
const { add, getByOrderId, deleteByOrderId, getByOrderIdAndProductId, updateByOrderIdAndProductId, deleteByOrderIdAndProductId } = require("../models/orderItems");

exports.getOrderItemsByOrder = async (req, res) => {
  const orderId = req.params.orderId;

  if (!uuid.validate(orderId))
    return res.status(400).json();

  if (req.isAuthenticated()) {

    try {
      const getOrderResponse = await getById(orderId);

      if (getOrderResponse.rowCount===1) {

        const userId = getOrderResponse.rows[0]["user_id"];

        // user can only see their own orders
        // admin can see any order
        if (req.user["is_admin"] || userId === req.user["id"]){

          const getOrderItemsResponse = await getByOrderId(orderId);
          return res.json(getOrderItemsResponse.rows);

        } else {
          return res.status(403).json();
        }

      } else {
        return res.status(404).json({error:"Unable to find order"});
      }

    } catch (error) {
      return res.status(400).json({error});
    }
  } else {
    // show nothing to unauthenticated users
    return res.status(401).json();
  }
};

exports.deleteAllOrderItemsByOrder = async (req, res) => {
  const orderId = req.params.orderId;

  if (!uuid.validate(orderId))
    return res.status(400).json();

  if (req.isAuthenticated()) {

    try {

      // only admins can update order items directly
      if (req.user["is_admin"]){

        const deleteOrderItemsResponse = await deleteByOrderId(orderId);

        if (deleteOrderItemsResponse.rowCount>0) {
          return res.status(204).json({message:"Successfully deleted"});
        } else {
          return res.status(404).json({error:"Order items not found"});
        }

      } else {
        return res.status(403).json();
      }

    } catch (error) {
      return res.status(400).json({error});
    }
  } else {
    // show nothing to unauthenticated users
    return res.status(401).json();
  }
};

exports.getOrderItemByOrderAndProduct = async (req, res) => {
  const orderId = req.params.orderId;
  const productId = req.params.productId;

  if (!uuid.validate(orderId))
    return res.status(400).json();

  if (!uuid.validate(productId))
    return res.status(400).json();

  if (req.isAuthenticated()) {

    try {
      const getOrderResponse = await getById(orderId);

      if (getOrderResponse.rowCount===1) {

        const userId = getOrderResponse.rows[0]["user_id"];

        // user can only see their own orders
        // admin can see any order
        if (req.user["is_admin"] || userId === req.user["id"]){

          const getOrderItemsResponse = await getByOrderIdAndProductId(orderId,productId);

          if (getOrderItemsResponse.rowCount===1) {
            return res.json(getOrderItemsResponse.rows[0]);
          } else {
            return res.status(404).json({error:"Order item not found"});
          }

        } else {
          return res.status(403).json();
        }

      } else {
        return res.status(404).json({error:"Unable to find order"});
      }

    } catch (error) {
      return res.status(400).json({error});
    }
  } else {
    // show nothing to unauthenticated users
    return res.status(401).json();
  }
};

exports.addOrderItemByOrderAndProduct = async (req, res) => {
  const orderId = req.params.orderId;
  const productId = req.params.productId;
  const { amount, unitPrice } = req.body;

  if (!uuid.validate(orderId))
    return res.status(400).json();

  if (!uuid.validate(productId))
    return res.status(400).json();

  if (req.isAuthenticated()) {

    if (req.user["is_admin"]) {

      // allow admin to add new order items
      try {
        const totalCost = amount * unitPrice;

        const addOrderItemResponse = await add(orderId,productId,amount,unitPrice,totalCost);

        if (addOrderItemResponse.rowCount===1) {
          return res.status(201).json({orderId,productId,amount,unitPrice,totalCost});
        } else {
          return res.status(400).json({error:"Unable to add order item"});
        }
      } catch (error) {
        res.status(500).json({error});
      }

    } else {
      // do not allow non-admins to add an order item
      return res.status(403).json();
    }

  } else {
    // do not allow non-admins to add an order item
    return res.status(401).json();
  }

};

exports.updateOrderItemByOrderAndProduct = async (req, res) => {

  const orderId = req.params.orderId;
  const productId = req.params.productId;
  const { amount, unitPrice } = req.body;

  if (!uuid.validate(orderId))
    return res.status(400).json();

  if (!uuid.validate(productId))
    return res.status(400).json();

  if (req.isAuthenticated()) {

    try {
      // only admins can update order items directly
      if (req.user["is_admin"]){
        const updateOrderItemResponse = await updateByOrderIdAndProductId(orderId,productId,amount,unitPrice);

        if (updateOrderItemResponse.rowCount===1) {
          return res.status(200).json({message:"Successfully updated"});
        } else {
          return res.status(404).json({error:"Order item not found for this product"});
        }

      } else {
        return res.status(403).json();
      }

    } catch (error) {
      console.log(error);
      return res.status(400).json({error});
    }
  } else {
    // show nothing to unauthenticated users
    return res.status(401).json();
  }
};

exports.deleteOrderItemByOrderAndProduct = async (req, res) => {
  const orderId = req.params.orderId;
  const productId = req.params.productId;

  if (!uuid.validate(orderId))
    return res.status(400).json();

  if (!uuid.validate(productId))
    return res.status(400).json();

  if (req.isAuthenticated()) {

    try {
      const getOrderResponse = await getById(orderId);

      if (getOrderResponse.rowCount===1) {

        const userId = getOrderResponse.rows[0]["user_id"];

        // user can only see their own orders
        // admin can see any order
        if (req.user["is_admin"] || userId === req.user["id"]){

          const deleteOrderItemsResponse = await deleteByOrderIdAndProductId(orderId,productId);

          if (deleteOrderItemsResponse.rowCount===1) {
            return res.status(204).json({message:"Successfully deleted"});
          } else {
            return res.status(404).json({error:"Order items not found"});
          }

        } else {
          return res.status(403).json();
        }

      } else {
        return res.status(404).json({error:"Unable to find order"});
      }

    } catch (error) {
      return res.status(400).json({error});
    }
  } else {
    // show nothing to unauthenticated users
    return res.status(401).json();
  }
};