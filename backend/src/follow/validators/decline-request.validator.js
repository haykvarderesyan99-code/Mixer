export default async function declineRequestValidator(service, req, res, next) {
    const { id } = req.params;
    const request = await service.getRequestById(id);

    if (!request) {
        return res.status(404).send({ message: "Not found" });
    }

    // Verify the request is for the current user
    if (request.to !== req.user.id) {
        return res.status(403).send({ message: "Forbidden" });
    }

    await request.destroy();

    return next();
}
