import express from "express";
import init from "./auth.provider.js";

export const authRouter = express.Router();

const { authController } = init.controllers;
const { isAuthenticated } = init.middlewares;
const { signupPipe } = init.pipes;

const {
    signupValidator,
    signinValidator,
} = init.validators;

authRouter.post(
    "/signup",
    [signupValidator, signupPipe],
    authController.signup
);
authRouter.post("/signin", signinValidator, authController.signin);

authRouter.get("/user", isAuthenticated, authController.getUser);