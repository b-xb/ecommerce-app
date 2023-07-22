const uuid  = require("uuid");
const { getById } = require("../models/orders");
const { getByOrderId, deleteByOrderId, getByOrderIdAndProductId, deleteByOrderIdAndProductId } = require("../models/orderItems");

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

exports.addOrderItemsByOrder = async (req, res) => {
  return res.json();
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

exports.updateOrderItemByOrderAndProduct = async (req, res) => {
  return res.json();
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