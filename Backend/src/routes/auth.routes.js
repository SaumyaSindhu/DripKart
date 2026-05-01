import { Router } from 'express';
import { validateLoginUser, validateRegisterUser } from "../validators/auth.validator.js";
import { loginController, registerController } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post("/register", validateRegisterUser, registerController)

authRouter.post("/login", validateLoginUser, loginController)

export default authRouter;