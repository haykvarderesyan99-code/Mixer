import models from "../../config/database/index.js";
import accountChangePasswordValidator from "./validators/account-change-password.validator.js";
import bcrypt from "bcrypt";
import { AccountController } from "./account.controller.js";
import { AccountService } from "./account.service.js";
import { isAuthenticated } from "../../middlewares/authentication.js";
import { filterPrivateAccountData } from "../../middlewares/privacy.js";
import { Op } from "sequelize";
import { SAFE_USER } from "../../lib/attributes.js";
import { BcryptService } from "./bcrypt.service.js";
import updateBioValidator from "./validators/update-bio.validator.js";
import { chatService } from "../chat/chat.provider.js";
import { sequelize } from "../../config/database/database.config.js";
import deleteAccountValidator from "./validators/delete-account.validator.js";

const bcryptService = new BcryptService(bcrypt);
const accountService = new AccountService(
    models.User,
    models.Follow,
    models.Post,
    models.Comment,
    models.PostReaction,
    bcryptService,
    chatService,
    sequelize,
    Op,
    SAFE_USER
);
const accountController = new AccountController(accountService);

const loader = {};

loader.models = {
    User: models.User,
    Follow: models.Follow,
};

loader.services = {
    accountService,
    bcryptService,
};

loader.controllers = {
    accountController,
};

loader.middlewares = {
    isAuthenticated: isAuthenticated.bind(null, loader.services.accountService),
    filterPrivateAccountData: filterPrivateAccountData(models.Follow),
};

loader.validators = {
    accountChangePasswordValidator: accountChangePasswordValidator.bind(
        null,
        accountService
    ),
    updateBioValidator,
    deleteAccountValidator: deleteAccountValidator.bind(
        null,
        accountService
    ),
};

export default loader;
