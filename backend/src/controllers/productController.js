const Product = require("../models/Product"); // make sure to create this model

// Controller to add a product
const addProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      qty: req.body.qty,
      rate: req.body.rate,
      total: req.body.qty * req.body.rate,
      createdBy: req.user.userId,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get the list of products
const listProducts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const products = await Product.find({ createdBy: userId });
    if (!products) {
      return res.status(404).send("No products found for this user.");
    }
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};
module.exports = {
  addProduct,
  listProducts,
};
