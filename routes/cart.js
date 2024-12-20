const express = require("express");
const { CartItem, Product } = require("../models");
const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{ model: Product }], 
    });

    if (cartItems.length === 0) {
      return res.status(404).json({ message: "No items found in the cart" });
    }

    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { userId, productId } = req.body; 

    if (!userId || !productId) {
      return res.status(400).json({ error: "userId and productId are required" });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const cartItem = await CartItem.create({ userId, productId });
    
    res.status(201).json(cartItem); 
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/remove/:cartItemId", async (req, res) => {
  try {
    const { cartItemId } = req.params;

    if (!cartItemId) {
      return res.status(400).json({ error: "Cart item ID is required" });
    }

    const result = await CartItem.destroy({
      where: { id: cartItemId },
    });

    if (result) {
      res.json({ message: "Cart item deleted successfully" });
    } else {
      res.status(404).json({ error: "Cart item not found" });
    }
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});

module.exports = router;