export default async function loadChatValidator(service, req, res, next) {
    const { id } = req.user;
    const { partnerId } = req.body;

    if (!partnerId) {
        return res.status(400).send({ message: "Missing/Invalid ID..." });
    }

    if (partnerId == id) {
        return res.status(400).send({ message: "Cannot DM yourself..." });
    }

    const isMessageAllowed = await service.canMessageUser(id, partnerId);
    if (!isMessageAllowed) {
        return res
            .status(403)
            .send({ message: "This account is private, follow to message..." });
    }

    return next();
}
