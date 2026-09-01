export default async function accountChangePasswordValidator(
    service,
    req,
    res,
    next
) {
    // Check if request body exists
    if (!req.body || typeof req.body !== 'object') {
        return res
            .status(400)
            .send({ message: "Request body is required" });
    }

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
        return res
            .status(401)
            .send({ message: "User not authenticated" });
    }

    const { currentPassword='', newPassword='' } = req.body;
    const { id } = req.user;

    // Check if required fields are present
    if (!currentPassword || !newPassword) {
        return res
            .status(400)
            .send({ message: "currentPassword and newPassword are required" });
    }

    // Check if fields are valid strings
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
        return res
            .status(400)
            .send({ message: "currentPassword and newPassword must be strings" });
    }

    // Check if fields are not empty after trimming
    if (!currentPassword.trim() || !newPassword.trim()) {
        return res
            .status(400)
            .send({ message: "currentPassword and newPassword cannot be empty" });
    }

    // Check if new password meets minimum length requirement
    if (newPassword.length < 6) {
        return res
            .status(400)
            .send({ message: "New password must be at least 6 characters long" });
    }

    const user = await service.findUserWithPassword({ id });
    const isPasswordCorrect = await service.checkPassword(
        currentPassword,
        user.password
    );

    if (!isPasswordCorrect) {
        return res.status(400).send({
            message:
                "Your current password is incorrect, try another or reset if you forgot",
        });
    }

    if (currentPassword == newPassword) {
        return res.status(400).send({
            message: "You have used this password previously, try another",
        });
    }

    user.password = await service.hashPassword(newPassword);
    await user.save();

    return next();
}
