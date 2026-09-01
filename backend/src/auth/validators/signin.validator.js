export default async function signinValidator(
    service,
    req,
    res,
    next
) {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
        return res
            .status(400)
            .send({ message: "Invalid/Missing credentials!" });
    }

    const user = await service.foundByUsername(username);
    if (!user) {
        return res.status(400).send({ message: "Wrong Credentials..." });
    }

    const isPasswordCorrect = await service.checkPassword(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        return res.status(400).send({ message: "Wrong Credentials..." });
    }

    req.user = user;
    return next();
}
