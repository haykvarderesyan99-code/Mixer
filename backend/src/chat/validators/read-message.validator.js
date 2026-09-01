export default async function readMessageValidator(service, req, res, next) {
    const { chatId } = req.params;
    const { id } = req.user;

    const isMember = await service.isMember(chatId, id);
    if (!isMember) {
        return res.status(403).send({ message: "Forbidden" });
    }

    return next();
}
