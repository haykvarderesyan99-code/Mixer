import express from "express";
import init from "./account.provider.js";
import { upload } from "../../lib/upload.js";

const { accountController } = init.controllers;
const { isAuthenticated, filterPrivateAccountData } = init.middlewares;
const {
    accountChangePasswordValidator,
    updateBioValidator,
    deleteAccountValidator,
} = init.validators;

export const accountRouter = express.Router();

accountRouter.use(isAuthenticated);

accountRouter.patch("/privacy", accountController.setAccountPrivacy);

accountRouter.patch(
    "/settings/password",
    accountChangePasswordValidator,
    accountController.changeUserPassword
);

accountRouter.patch(
    "/avatar",
    upload.single("profile-pic"),
    accountController.handleAvatarUpload
);

accountRouter.patch("/bio", updateBioValidator, accountController.updateBio);

accountRouter.patch("/theme", accountController.updateTheme);

accountRouter.delete(
    "/",
    deleteAccountValidator,
    accountController.deleteAccount
);

accountRouter.get("/search/:text", accountController.searchUsers);

accountRouter.get("/:username", filterPrivateAccountData, accountController.getUserInfo);
