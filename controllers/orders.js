const uuid  = require("uuid");
const { get, add, getById, getByUserId, updateStatusById, deleteById, deleteByUserId } = require("../models/orders");

exports.getOrders = async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user["is_admin"]){
      // show any order to an admin
      try {
        const getOrdersResponse = await get();
        return res.status(200).json(getOrdersResponse.rows);
      } catch (error) {
        return res.status(400).json({error});
      }
    } else {
      // non-admins should use different path
      return res.status(403).json();
    }
  } else {
    // show nothing to unauthenticated users
    return res.status(401).json();
  }
};

exports.getOrderById = async (req, res) => {
  const id = req.params.orderId;

  if (req.isAuthenticated()) {
    try {
      const getOrdersResponse = await getById(id);

      if (getOrdersResponse.rowCount===1) {

        const userId = getOrdersResponse.rows[0]["user_id"];

        // user can only see their own orders
        // admin can see any order
        if (req.user["is_admin"] || userId === req.user["id"]){
          return res.json(getOrdersResponse.rows[0]);
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

exports.deleteOrderById = async (req, res) => {

  const id = req.params.orderId;

  if (!uuid.validate(id))
    return res.status(400).json();

  if (req.isAuthenticated()) {
    if (req.user["is_admin"]){
      // allow admin to delete orders
      try {
        const deleteOrderResponse = await deleteById(id);

        if (deleteOrderResponse.rowCount===1) {
          return res.status(204).json({message:"Successfully deleted"});
        } else {
          return res.status(404).json({error:"Product not found"});
        }
      } catch (error) {
        return res.status(400).json({error});
      }
    } else {
      // Non-admins cannot delete orders
      return res.status(403).json();
    }
  } else {
    // show nothing to unauthenticated users
    return res.status(401).json();
  }
};

exports.getOrderStatusById = async (req, res) => {
  const id = req.params.orderId;

  if (req.isAuthenticated()) {
    try {
      const getOrdersResponse = await getById(id);

      if (getOrdersResponse.rowCount===1) {

        const userId = getOrdersResponse.rows[0]["user_id"];

        // user can only see their own orders
        // admin can see any order
        if (req.user["is_admin"] || userId === req.user["id"]){
          return res.json(getOrdersResponse.rows[0]["status"]);
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

exports.updateOrderStatusById = async (req, res) => {
  const id = req.params.orderId;
  const status = req.body.status;

  if (!uuid.validate(id))
    return res.status(400).json();

  if (req.isAuthenticated()) {
    if (req.user["is_admin"]){
      // show any user to an admin
      try {
        const updateProductResponse = await updateStatusById(id, status);

        if (updateProductResponse.rowCount===1) {
          return res.status(200).json(status);
        } else {
          return res.status(404).json({error:"Product not found"});
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

exports.getOrdersByUser = async (req, res) => {

  const userId = req.params.userId;

  if (req.isAuthenticated()) {
    try {
      const getOrdersResponse = await getByUserId(userId);

      // user can only see their own orders
      // admin can see any order
      if (req.user["is_admin"] || userId === req.user["id"]){
        return res.json(getOrdersResponse.rows);
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

exports.addOrderByUser = async (req, res) => {
  return res.json();
};

exports.deleteAllOrdersByUser = async (req, res) => {

  const userId = req.params.userId;

  if (!uuid.validate(userId))
    return res.status(400).json();

  if (req.isAuthenticated()) {
    if (req.user["is_admin"]){
      // show any user to an admin
      try {
        const deleteOrderResponse = await deleteByUserId(userId);

        if (deleteOrderResponse.rowCount>0) {
          return res.status(204).send("Orders deleted");
        } else {
          return res.status(404).json({error:"Product not found"});
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