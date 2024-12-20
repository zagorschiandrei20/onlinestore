const express = require("express");
const router = express.Router();
const { Product } = require("../models");
const { body, validationResult } = require("express-validator");

router.get("/", async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

router.post(
  "/",
  [body("name").notEmpty(), body("price").isFloat({ gt: 0 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const product = await Product.create(req.body);
    res.json(product);
  }
);

module.exports = router;