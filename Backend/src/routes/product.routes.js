import express from 'express';
import { Router } from 'express';
import { authenticateSeller } from '../middlewares/auth.middleware.js';

const productRouter = Router();

productRouter.post("/", authenticateSeller)

export default productRouter;