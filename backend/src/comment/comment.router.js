import express from "express";
import init from "./comment.provider.js";

export const commentRouter = express.Router({ mergeParams: true });

const { commentController } = init.controllers;
const { isAuthenticated } = init.middlewares;
const { deleteCommentValidator, reactValidator } = init.validators;

commentRouter.use(isAuthenticated);

commentRouter.get("/", commentController.getAllComments);
commentRouter.post("/", commentController.addComment);
commentRouter.delete(
    "/:commentId",
    deleteCommentValidator,
    commentController.deleteComment
);
commentRouter.post(
    "/:commentId/reactions",
    reactValidator,
    commentController.react
);
commentRouter.get("/:commentId/reactions", commentController.getAllReactions);
