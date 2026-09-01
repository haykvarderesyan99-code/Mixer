export default async function followValidator(service, req, res, next) {
    const { id: to } = req.params;
    const { id: from } = req.user;

    if (Number(from) === Number(to)) {
        return res.status(400).send({
            status: "Invalid",
            message: "You cannot follow yourself",
        });
    }

    const account = await service.getUser(to);
    if (!account) {
        return res
            .status(404)
            .send({ status: "NotFound", message: "User not found" });
    }

    const found = await service.getRequest(from, to);
    if (account.isAccountPrivate) {
        if (found && found.approved === false) {
            await found.destroy();
            return res.status(200).send({ status: "Cancelled" });
        }

        if (!found) {
            const result = await service.createRequest(from, to, false, true);
            return res.status(201).send({ status: "Requested", result });
        }

        await found.destroy();
        return res.status(200).send({ status: "Unfollowed" });
    }

    if (found) {
        await found.destroy();
        return res.status(200).send({ status: "Unfollowed" });
    }

    return next();
}
