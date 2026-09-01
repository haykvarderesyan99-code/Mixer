export default async function verifyValidator(
    service,
    sendEmail,
    req,
    res,
    next
) {
    const { email } = req.body;
    const otpInput = req.body.otp;

    const otp =
        typeof otpInput === "string"
            ? otpInput.trim()
            : String(otpInput || "").trim();
    if (!email || !otp) {
        return res.status(400).send({ message: "Unverified..." });
    }

    const user = await service.foundByEmail(email);
    if (!user) return res.status(404).send({ message: "User not found..." });

    const createdAt =
        typeof user.otpCreatedAt === "number"
            ? user.otpCreatedAt
            : new Date(user.otpCreatedAt).getTime();

    const expired = Date.now() - createdAt > 120000;

    if (expired || user.isOtpExpired) {
        user.isOtpExpired = true;
        await user.save();

        const newOtp = await service.generateOTP(user);

        void sendEmail(
            user.email,
            "Your new Lyncora verification code",
            `Your previous code expired. Your new verification code is ${newOtp}. It expires in 2 minutes.`
        );

        return res.status(400).send({
            message:
                "The code is expired, we sent you the new one, please check your email...",
        });
    }

    const storedOtp =
        typeof user.otp === "string"
            ? user.otp.trim()
            : String(user.otp || "").trim();
    if (storedOtp !== otp) {
        return res.status(400).send({ message: "Wrong code" });
    }

    user.isSigninAllowed = true;
    await user.save();

    return next();
}
