import express from "express";
import init from "./chat.provider.js";
import { getVersion, setVersion } from "./version.store.js";

export const chatRouter = express.Router();

const { chatController } = init.controllers;
const { isAuthenticated } = init.middlewares;
const {
    getMessageValidator,
    sendMessageValidator,
    readMessageValidator,
    loadChatValidator,
    deleteChatValidator,
    deleteMessageValidator,
} = init.validators;

chatRouter.use(isAuthenticated);

chatRouter.get("/", chatController.loadChats);

chatRouter.post("/dm", loadChatValidator, chatController.loadChat);

chatRouter.get(
    "/:chatId/messages",
    getMessageValidator,
    chatController.getMessages
);

chatRouter.post(
    "/:chatId/messages",
    sendMessageValidator,
    chatController.sendMessage
);

chatRouter.post(
    "/:chatId/read",
    readMessageValidator,
    chatController.readMessage
);

chatRouter.delete(
    "/:chatId/messages/:messageId",
    deleteMessageValidator,
    chatController.deleteMessage
);

chatRouter.delete("/:chatId", deleteChatValidator, chatController.deleteChat);

chatRouter.get("/:chatId/version", async (req, res) => {
    try {
        const { chatId } = req.params;
        const version = await getVersion(chatId);
        return res.status(200).send({ version });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Failed to get version" });
    }
});

chatRouter.post("/:chatId/version", async (req, res) => {
    try {
        const { chatId } = req.params;
        const { version } = req.body;
        if (!version) return res.status(400).send({ message: "Missing version" });
        const saved = await setVersion(chatId, version);
        return res.status(200).send({ version: saved });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Failed to set version" });
    }
});
