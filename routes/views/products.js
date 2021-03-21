const express = require("express");
const router = express.Router();
const ProductsService = require('../../service/products');
const { config } = require('../../config');

const productService = new ProductsService();
const {FIVE_MINUTES_IN_SECONDS } = require('../../utils/time');


const cacheResponse = require('../../utils/cacheResponse');


router.get("/", async function (req, res, next) {
  
  cacheResponse(req, FIVE_MINUTES_IN_SECONDS);

  const { tags } = req.query;

  try {
    //throw new Error("this is an error");
    const products = await productService.getProducts({ tags });

    res.render("products", { products, dev: config.dev });
  } catch (err) {
    next(err);
  }
});


module.exports = router;