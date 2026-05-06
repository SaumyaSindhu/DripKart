import { Router } from 'express';
import { validateLoginUser, validateRegisterUser } from "../validators/auth.validator.js";
import { getMeController, googleCallbackController, loginController, registerController } from '../controllers/auth.controller.js';
import passport from 'passport';
import { config } from '../config/config.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user (Buyer or Seller)
 * @access Public
 */
authRouter.post("/register", validateRegisterUser, registerController)

/**
 * @route POST /api/auth/login
 * @desc Login an existing user
 * @access Public
 */
authRouter.post("/login", validateLoginUser, loginController)

/**
 * @route GET /api/auth/google
 * @desc Authenticate with Google OAuth
 * @access Public
 */
authRouter.get("/google", 
    passport.authenticate("google", { scope: ["profile", "email"]}))

/**
 * @route GET /api/auth/google/callback
 * @desc Google OAuth callback URL
 * @access Public
 */
authRouter.get("/google/callback", 
    passport.authenticate("google", { 
        session: false, 
        failureRedirect: config.NODE_ENV === "development" ? "http://localhost:5173/login" : "/login"
    }), 
    googleCallbackController
)

/**
 * @route GET /api/auth/me
 * @desc Get the authenticated user's profile
 * @access Private
 */
authRouter.get("/me", authenticateUser, getMeController)

export default authRouter;