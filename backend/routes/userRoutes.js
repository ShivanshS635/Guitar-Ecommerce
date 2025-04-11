import express from "express";

const userRouter = express.Router();
import { registerUser, loginUser, adminLogin } from "../controllers/userController.js";

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

export default userRouter;