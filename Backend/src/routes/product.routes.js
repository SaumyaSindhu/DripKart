import express from 'express';
import { Router } from 'express';
import { authenticateSeller } from '../middlewares/auth.middleware.js';
import { createProductController } from '../controllers/product.controller.js';
import { createProductValidator } from '../validators/product.validator.js';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize : 5 * 1024 * 1024 // 5MB
    }
}) 

const productRouter = Router();

productRouter.post("/create", authenticateSeller, createProductValidator, upload.array("images", 7),  createProductController)

export default productRouter;