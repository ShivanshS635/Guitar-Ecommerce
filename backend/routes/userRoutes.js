import express from "express";

const userRouter = express.Router();
import { registerUser, loginUser, adminLogin , resetPassword , forgotPassword } from "../controllers/userController.js";

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetPassword);

export default userRouter;