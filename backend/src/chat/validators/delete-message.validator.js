export default async function deleteMessageValidator(service, req, res, next) {
    const { chatId, messageId } = req.params;
    const { id } = req.user;

    const isMember = await service.isMember(chatId, id);
    if (!isMember) return res.status(403).send({ message: "Forbidden" });

    const message = await service.findMessageInChat(chatId, messageId);
    if (!message) return res.status(404).send({ message: "Message not found" });

    if (message.userId != id) {
        return res
            .status(403)
            .send({ message: "You can unsend only your messages" });
    }

    return next();
}
