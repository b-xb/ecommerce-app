const uuid  = require("uuid");
const { get, add, getById, updateById, deleteById } = require("../models/products");


exports.getProducts = async (req, res) => {
  try {
    const getProductsResponse = await get();
    return res.status(200).json(getProductsResponse.rows);
  } catch (error) {
    res.status(500).json({error});
  }
};

exports.addProduct = async (req, res) => {
  if (req.isAuthenticated() && req.user["is_admin"]) {
    // allow admin to add new Products
    const { name, description, unitPrice, stock } = req.body;
    const id = uuid.v4();

    try {
      const addProductResponse = await add(id, name, description, unitPrice, stock);

      if (addProductResponse.rowCount===1) {
        return res.status(201).json({id, name, description, unitPrice, stock});
      } else {
        return res.status(400).json({error:"Unable to add product"});
      }
    } catch (error) {
      res.status(500).json({error});
    }
  } else {
    // do not allow non-admins to add a user
    return res.status(401).json();
  }
};

exports.getProductById = async (req, res) => {
  const id = req.params.productId;

  if (!uuid.validate(id))
    return res.status(400).json();

  try {
    const getProductResponse = await getById(id);
    if (getProductResponse.rowCount===1) {
      return res.status(200).json(getProductResponse.rows[0]);
    } else {
      return res.status(404).json({error:"Product not found"});
    }
  } catch (error) {
    res.status(500).json({error});
  }
};

exports.updateProductById = async (req, res) => {
  const id = req.params.productId;
  const { name, description, unitPrice, stock } = req.body;

  if (!uuid.validate(id))
    return res.status(400).json();

  if (req.isAuthenticated()) {
    if (req.user["is_admin"]){
      // show any user to an admin
      try {
        const updateProductResponse = await updateById(id, name, description, unitPrice, stock);

        if (updateProductResponse.rowCount===1) {
          return res.status(200).json({message:"Successfully updated"});
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

exports.deleteProductById = async (req, res) => {
  const id = req.params.productId;

  if (!uuid.validate(id))
    return res.status(400).json();

  if (req.isAuthenticated()) {
    if (req.user["is_admin"]){
      // show any user to an admin
      try {
        const deleteProductResponse = await deleteById(id);

        if (deleteProductResponse.rowCount===1) {
          return res.status(204).json({message:"Successfully deleted"});
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