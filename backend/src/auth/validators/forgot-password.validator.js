export default async function forgotPasswordValidator(
    service,
    req,
    res,
    next
) {
    const { username } = req.body;

    if (!username) {
        return res
            .status(400)
            .send({ message: "Invalid/Missing credentials..." });
    }
    const user = await service.foundByUsername(username);
    if (!user) {
        return res.status(404).send({ message: "User not found..." });
    }

    const otp = await service.generateOTP(user);

    return next();
}
