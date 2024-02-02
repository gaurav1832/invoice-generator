const express = require("express");

const {
  addProduct,
  listProducts,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/add", authMiddleware, addProduct);

// GET route for listing products
router.get("/list", authMiddleware, listProducts);

module.exports = router;
