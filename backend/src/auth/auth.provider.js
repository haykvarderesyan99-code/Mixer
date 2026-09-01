import models from "../../config/database/index.js";
import signupValidator from "./validators/signup.validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import signinValidator from "./validators/signin.validator.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { BcryptService } from "./bcrypt.service.js";
import { CryptoService } from "./crypto.service.js";
import { JWTService } from "./jwt.service.js";
import { signupPipe } from "./pipes/signup.pipe.js";
import { SAFE_USER } from "../../lib/attributes.js";
import { isAuthenticated } from "../../middlewares/authentication.js";

const bcryptService = new BcryptService(bcrypt);
const jwtService = new JWTService(jwt);
const cryptoService = new CryptoService(crypto);
export const authService = new AuthService(
    models.User,
    models.Follow,
    bcryptService,
    jwtService,
    cryptoService,
    SAFE_USER
);
const authController = new AuthController(authService);

const loader = {};

loader.services = {
    authService,
    bcryptService,
    jwtService,
    cryptoService,
};

loader.controllers = {
    authController,
};

loader.middlewares = {
    isAuthenticated: isAuthenticated.bind(null, loader.services.authService),
};

loader.validators = {
    signupValidator: signupValidator.bind(null, authService),
    signinValidator: signinValidator.bind(null, authService),
};

loader.pipes = {
    signupPipe: signupPipe.bind(null, bcryptService),
};

export default loader;
