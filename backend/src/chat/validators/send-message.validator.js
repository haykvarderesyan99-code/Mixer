export default async function sendMessageValidator(service, req, res, next) {
    const { chatId } = req.params;
    const { id } = req.user;

    const isMember = await service.isMember(chatId, id);
    if (!isMember) return res.status(403).send({ message: "Forbidden" });

    const members = await service.findMembers(chatId);

    if (members.length === 2) {
        const partnerId = members.find((m) => m.userId !== id)?.userId;

        if (partnerId) {
            const partner = await service.findUserByIdIncludingDeleted(
                partnerId
            );
            if (!partner || partner.deletedAt) {
                return res.status(410).send({
                    message:
                        "This user deleted their account. You can’t send new messages.",
                });
            }

            const isMessageAllowed = await service.canMessageUser(
                id,
                partnerId
            );
            if (!isMessageAllowed) {
                return res.status(403).send({
                    message:
                        "Sending message is not allowed, follow to message...",
                });
            }
        }
    }

    return next();
}
