const uuid  = require("uuid");
const { add, getByUserId, deleteByUserId, updateByUserIdAndProductId, deleteByUserIdAndProductId, } = require("../models/cartItems");

exports.getCartItemsByUser = async (req, res) => {
  const userId = req.params.userId;

  if (req.isAuthenticated()) {
    try {
      const getCartResponse = await getByUserId(userId);

      // user can only see their own orders
      // admin can see any order
      if (req.user["is_admin"] || userId === req.user["id"]){
        return res.json(getCartResponse.rows);
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

exports.deleteAllCartItemsByUser = async (req, res) => {
  const userId = req.params.userId;

  if (req.isAuthenticated()) {
    try {
      // user can only see their own orders
      // admin can see any order
      if (req.user["is_admin"] || userId === req.user["id"]){
        const deleteCartResponse = await deleteByUserId(userId);

        if (deleteCartResponse.rowCount>0) {
          return res.status(204).send("Cart Items deleted");
        } else {
          return res.status(404).json({error:"No Cart Items found"});
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

exports.addCartItemByUserAndProduct = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  const { amount } = req.body;

  if (!uuid.validate(userId))
    return res.status(400).json();

  if (!uuid.validate(productId))
    return res.status(400).json();

  if (req.isAuthenticated()) {
    try {
      // user can only see their own orders
      // admin can see any order
      if (req.user["is_admin"] || userId === req.user["id"]){
        const addCartItemResponse = await add(userId,productId,amount);

        if (addCartItemResponse.rowCount===1) {
          return res.status(201).json({userId,productId,amount});
        } else {
          return res.status(400).json({error:"Unable to add cart item"});
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

exports.updateCartItemByUserAndProduct = async (req, res) => {

  const userId = req.params.userId;
  const productId = req.params.productId;
  const { amount } = req.body;

  if (!uuid.validate(userId))
    return res.status(400).json();

  if (!uuid.validate(productId))
    return res.status(400).json();

  if (req.isAuthenticated()) {
    try {
      // user can only see their own orders
      // admin can see any order
      if (req.user["is_admin"] || userId === req.user["id"]){
        const updateCartItemResponse = await updateByUserIdAndProductId(userId,productId,amount);

        if (updateCartItemResponse.rowCount===1) {
          return res.status(200).json({
            message:"Successfully updated",
            success: true,
          });
        } else {
          return res.status(400).json({error:"Unable to update cart item"});
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

exports.deleteCartItemByUserAndProduct = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  if (!uuid.validate(userId))
    return res.status(400).json();

  if (!uuid.validate(productId))
    return res.status(400).json();

  if (req.isAuthenticated()) {
    try {
      // user can only see their own orders
      // admin can see any order
      if (req.user["is_admin"] || userId === req.user["id"]){
        const deleteCartItemResponse = await deleteByUserIdAndProductId(userId,productId);

        if (deleteCartItemResponse.rowCount===1) {
          return res.status(204).json({
            message:"Successfully deleted",
            success: true,
          });
        } else {
          return res.status(404).json({error:"Cart item for this product not found"});
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
