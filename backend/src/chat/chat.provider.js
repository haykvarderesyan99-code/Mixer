import models from "../../config/database/index.js";
import getMessageValidator from "./validators/get-message.validator.js";
import sendMessageValidator from "./validators/send-message.validator.js";
import loadChatValidator from "./validators/load-chat.validator.js";
import readMessageValidator from "./validators/read-message.validator.js";
import deleteChatValidator from "./validators/delete-chat.validator.js";
import deleteMessageValidator from "./validators/delete-message.validator.js";
import { ChatController } from "./chat.controller.js";
import { ChatService } from "./chat.service.js";
import { isAuthenticated } from "../../middlewares/authentication.js";
import { authService } from "../auth/auth.provider.js";
import { SAFE_USER } from "../../lib/attributes.js";
import { sequelize } from "../../config/database/database.config.js";

export const chatService = new ChatService(
    models.Chat,
    models.Member,
    models.User,
    models.Message,
    models.Follow,
    SAFE_USER,
    sequelize
);
const chatController = new ChatController(chatService);

const loader = {};

loader.controllers = {
    chatController,
};

loader.services = {
    chatService,
};

loader.middlewares = {
    isAuthenticated: isAuthenticated.bind(null, authService),
};

loader.validators = {
    getMessageValidator: getMessageValidator.bind(null, chatService),
    sendMessageValidator: sendMessageValidator.bind(null, chatService),
    loadChatValidator: loadChatValidator.bind(null, chatService),
    readMessageValidator: readMessageValidator.bind(null, chatService),
    deleteChatValidator: deleteChatValidator.bind(null, chatService),
    deleteMessageValidator: deleteMessageValidator.bind(null, chatService),
};

export default loader;
