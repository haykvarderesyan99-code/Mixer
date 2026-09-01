export class ChatController {
    constructor(chatService) {
        this.chatService = chatService;

        this.loadChats = this.loadChats.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.loadChat = this.loadChat.bind(this);
        this.readMessage = this.readMessage.bind(this);
        this.deleteChat = this.deleteChat.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
    }

    async loadChats(req, res) {
        const chats = await this.chatService.getAllChats(req.user.id);
        return res.status(200).send({ chats });
    }

    async getMessages(req, res) {
        const { chatId } = req.params;
        const messages = await this.chatService.getUserMessages(chatId);
        return res.status(200).send({ messages });
    }

    async sendMessage(req, res) {
        const { chatId } = req.params;
        const { id } = req.user;
        const { text } = req.body;

        const message = await this.chatService.createMessage(chatId, id, text);
        return res.status(201).send({ message });
    }

    async loadChat(req, res) {
        const { id } = req.user;
        const { partnerId } = req.body;

        const chat = await this.chatService.getChat(id, partnerId);
        return res.status(200).send({ chat });
    }

    async readMessage(req, res) {
        const { chatId } = req.params;
        const { id } = req.user;

        await this.chatService.markChatRead(chatId, id);
        return res.status(200).send({ message: "Message read!" });
    }

    async deleteChat(req, res) {
        const { chatId } = req.params;
        const { id } = req.user;

        await this.chatService.deleteConversationForUser(chatId, id);
        return res.status(200).send({ message: "Conversation deleted" });
    }

    async deleteMessage(req, res) {
        const { chatId, messageId } = req.params;

        await this.chatService.unsendMessage(chatId, messageId);
        return res.status(200).send({ messageId: Number(messageId) });
    }
}
