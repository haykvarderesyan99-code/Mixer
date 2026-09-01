export default async function deleteAccountValidator(
    service,
    req,
    res,
    next
) {
    const { id } = req.user;

    const deleted = await service.deleteUserAccount(id);

    if (!deleted) {
        return res.status(404).send({ message: "User not found" });
    }

    return next();
}
