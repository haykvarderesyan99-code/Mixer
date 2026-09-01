import models from "../../config/database/index.js";
import acceptRequestValidator from "./validators/accept-request.validator.js";
import declineRequestValidator from "./validators/decline-request.validator.js";
import followValidator from "./validators/follow.validator.js";
import { FollowController } from "./follow.controller.js";
import { FollowService } from "./follow.service.js";
import { SAFE_USER } from "../../lib/attributes.js";
import { isAuthenticated } from "../../middlewares/authentication.js";
import { authService } from "../auth/auth.provider.js";

const followService = new FollowService(models.User, models.Follow, SAFE_USER);
const followController = new FollowController(followService);

const loader = {};

loader.services = { authService, followService };

loader.controllers = { followController };

loader.validators = {
    acceptRequestValidator: acceptRequestValidator.bind(
        null,
        loader.services.followService
    ),
    declineRequestValidator: declineRequestValidator.bind(
        null,
        loader.services.followService
    ),
    followValidator: followValidator.bind(null, loader.services.followService),
};

loader.middlewares = {
    isAuthenticated: isAuthenticated.bind(null, loader.services.authService),
};

export default loader;
