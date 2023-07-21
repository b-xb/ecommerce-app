const uuid  = require("uuid");
const { get, add, getById, updateById, deleteById } = require("../models/orders");

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
  return res.json();
};

exports.updateOrderById = async (req, res) => {
  return res.json();
};

exports.deleteOrderById = async (req, res) => {
  return res.json();
};

exports.getOrderStatusById = async (req, res) => {
  return res.json();
};

exports.updateOrderStatusById = async (req, res) => {
  return res.json();
};

exports.getOrdersByUser = async (req, res) => {
  return res.json();
};

exports.addOrderByUser = async (req, res) => {
  return res.json();
};

exports.deleteAllOrdersByUser = async (req, res) => {
  return res.json();
};