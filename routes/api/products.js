const express = require("express");
const router = express.Router();
const ProductsService = require("../../service/products");

const validation = require('../../utils/midlewares/validationHnadler');
const {
  productIdSchema,
  productTagSchema,
  createProductSchema,
  updateProductSchema,
} = require("../../utils/schemas/poducts");

const passport = require('passport');
// JWT Strategy
require('../../utils/auth/strateggies/jwt');

function productApi(app) {
  
  const router = express.Router();
  app.use("/api/products", router);
  
  
  const productService = new ProductsService();

  router.get("/", async function (req, res, next) {
    const { tags } = req.query;

    try {
      const products = await productService.getProducts({ tags });

      res.status(200).json({
        data: products,
        message: "products listed",
      });
    } catch (err) {
      next(err);
    }
  });

  router.get("/:productId", async function (req, res, next) {
    const { productId } = req.params;

    try {
      const product = await productService.getProduct({ productId });

      res.status(200).json({
        data: product,
        message: "products retrieve",
      });
    } catch (err) {
      next(err);
    }
  });

  router.post("/", validation(createProductSchema), async function (req, res, next) {
    const { body: product } = req;

    try {
      const createProduct = await productService.createProduct({ product });

      res.status(201).json({
        data: createProduct,
        message: "product created",
      });
    } catch (err) {
      next(err);
    }
  });

  router.put("/:productId",
    passport.authenticate("jwt", { session: false }),
    validation(productIdSchema, "params"),
    validation(updateProductSchema),
    async function (req, res, next) {
      const { productId } = req.params;
      const { body: product } = req;

      try {
        const updateProduct = await productService.updateProduct({
          productId,
          product,
        });

        res.status(200).json({
          data: updateProduct,
          message: "products update",
        });
      } catch (err) {
        next(err);
      }
    });

  router.delete(
    "/:productId",
    passport.authenticate("jwt", { session: false }),
    function (req, res, next) {
      const { productId } = req.params;

      try {
        const deleteProduct = productService.deleteProduct({ productId });

        res.status(200).json({
          data: deleteProduct,
          message: "products delete",
        });
      } catch (err) {
        next(err);
      }
    }
  );
}
module.exports = productApi;
