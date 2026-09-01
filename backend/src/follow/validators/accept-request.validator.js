export default async function acceptRequestValidator(service, req, res, next) {
    const { id } = req.params;
    const found = await service.getRequestById(id);

    if (!found) {
        return res.status(404).send({ message: "Not found" });
    }

    // Verify the request is for the current user
    if (found.to !== req.user.id) {
        return res.status(403).send({ message: "Forbidden" });
    }

    found.approved = true;
    await found.save();

    return next();
}
