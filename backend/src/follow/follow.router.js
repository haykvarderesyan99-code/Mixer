import express from "express";
import init from "./follow.provider.js";

export const followRouter = express.Router();

const { followController } = init.controllers;
const { isAuthenticated } = init.middlewares;
const { acceptRequestValidator, declineRequestValidator, followValidator } =
    init.validators;

followRouter.use(isAuthenticated);

followRouter.get("/requests", followController.getRequests);
followRouter.patch(
    "/requests/accept/:id",
    acceptRequestValidator,
    followController.acceptRequest
);
followRouter.patch(
    "/requests/decline/:id",
    declineRequestValidator,
    followController.declineRequest
);
followRouter.post("/:id", followValidator, followController.follow);
