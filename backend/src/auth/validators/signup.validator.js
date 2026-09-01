export default async function signupValidator(service, req, res, next) {
    let { firstName, lastName, username, password } = req.body;

    const fields = {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        username: username?.trim(),
        password: password?.trim(),
    };

    if (
        !fields.firstName ||
        !fields.lastName ||
        !fields.username ||
        !fields.password
    ) {
        return res.status(400).send({
            message: "Missing/Invalid credentials...",
        });
    }

    const nameRegex = /^[A-Za-z]{2,18}$/;

    if (!nameRegex.test(fields.firstName)) {
        return res.status(400).send({
            message: "First name must be 2-18 letters.",
        });
    }

    if (!nameRegex.test(fields.lastName)) {
        return res.status(400).send({
            message: "Last name must be 2-18 letters.",
        });
    }

    const usernameRegex = /^[A-Za-z0-9_]{3,18}$/;
    if (!usernameRegex.test(fields.username)) {
        return res.status(400).send({
            message:
                "Username must be 3-18 characters and use only letters, numbers, or underscores.",
        });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,18}$/;
    if (!passwordRegex.test(fields.password)) {
        return res.status(400).send({
            message:
                "Password must be 8-18 characters and include both letters and numbers.",
        });
    }

    const foundByUsername = await service.foundByUsername(username);
    if (foundByUsername) {
        return res
            .status(400)
            .send({ message: "Username is already in use..." });
    }

    return next();
}
