import express from 'express';
import { Router } from 'express';
import { authenticateSeller } from '../middlewares/auth.middleware.js';
import { addProductVariantController, createProductController, getAllProductsController, getProductDetailsController, getSellerProductsController } from '../controllers/product.controller.js';
import { createProductValidator } from '../validators/product.validator.js';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize : 5 * 1024 * 1024 // 5MB
    }
}) 

const productRouter = Router();

/**
 * @route POST /api/products/create
 * @desc Create a new product (Seller only)
 * @access Private (Seller)
 */
productRouter.post("/create", authenticateSeller, upload.array("images", 7), createProductValidator, createProductController);

/**
 * @route GET /api/products/seller
 * @desc Get all products (Seller only)
 * @access Private (Seller)
 */
productRouter.get("/seller", authenticateSeller, getSellerProductsController)

/**
 * @route GET /api/products/
 * @desc Get all products
 * @access Public
 */
productRouter.get("/", getAllProductsController)

/**
 * @route GET /api/products/detail/:id
 * @desc Get product details by ID
 * @access Public
 */
productRouter.get("/detail/:id", getProductDetailsController)

/**
 * @route POST /api/products/:productId/variants
 * @desc Add a new variant to a product
 * @acess Private (Seller only)
 */
productRouter.post("/:productId/variants", authenticateSeller, upload.array('images', 7), addProductVariantController)


export default productRouter;
