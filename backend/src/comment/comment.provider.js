import models from "../../config/database/index.js";
import deleteCommentValidator from "./validators/delete-comment.validator.js";
import reactValidator from "./validators/react.validator.js";
import { SAFE_USER } from "../../lib/attributes.js";
import { isAuthenticated } from "../../middlewares/authentication.js";
import { CommentController } from "./comment.controller.js";
import { CommentService } from "./comment.service.js";
import { authService } from "../auth/auth.provider.js";

const commentService = new CommentService(
    models.User,
    models.Comment,
    models.CommentReaction,
    SAFE_USER
);
const commentController = new CommentController(commentService, models.User);

const loader = {};

loader.services = {
    commentService,
    authService,
};

loader.controllers = {
    commentController,
};

loader.middlewares = {
    isAuthenticated: isAuthenticated.bind(null, loader.services.authService),
};

loader.validators = {
    deleteCommentValidator: deleteCommentValidator.bind(
        null,
        loader.services.commentService
    ),
    reactValidator: reactValidator.bind(null, loader.services.commentService),
};

export default loader;
