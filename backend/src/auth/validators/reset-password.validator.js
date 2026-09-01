export default async function resetPasswordValidator(
    service,
    req,
    res,
    next
) {
    const { password, username } = req.body;
    if (!password?.trim()) {
        return res
            .status(400)
            .send({ message: "Invalid/Missing credentials..." });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,18}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).send({
            message:
                "Password must be 8-18 characters and include both letters and numbers.",
        });
    }

    const user = await service.foundByUsername(username);
    const samePassword = await service.checkPassword(password, user.password);
    if (samePassword) {
        return res.status(400).send({
            message: "You have already used this password previously...",
        });
    }

    user.password = await service.hashPassword(password);
    await user.save();

    return next();
}
