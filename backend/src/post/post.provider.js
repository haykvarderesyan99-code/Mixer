import models from "../../config/database/index.js";
import deletePostValidator from "./validators/delete-post.validator.js";
import likeValidator from "./validators/like.validator.js";
import { PostController } from "./post.controller.js";
import { PostService } from "./post.service.js";
import { isAuthenticated } from "../../middlewares/authentication.js";
import { authService } from "../auth/auth.provider.js";
import { SAFE_USER } from "../../lib/attributes.js";

const postService = new PostService(
    models.User,
    models.Post,
    models.Comment,
    models.PostReaction,
    models.CommentReaction,
    SAFE_USER
);
const postController = new PostController(postService);

const loader = {};

loader.services = {
    authService,
    postService,
};

loader.controllers = {
    postController,
};

loader.middlewares = {
    isAuthenticated: isAuthenticated.bind(null, loader.services.authService),
};

loader.validators = {
    deletePostValidator: deletePostValidator.bind(
        null,
        loader.services.postService
    ),
    likeValidator: likeValidator.bind(null, loader.services.postService),
};

export default loader;
