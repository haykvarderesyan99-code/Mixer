export class AuthService {
    constructor(
        userModel,
        followModel,
        bcryptService,
        jwtService,
        cryptoService,
        SAFE_USER
    ) {
        this.userModel = userModel;
        this.followModel = followModel;
        this.bcryptService = bcryptService;
        this.jwtService = jwtService;
        this.cryptoService = cryptoService;

        this.SAFE_USER = SAFE_USER;
    }

    async foundByUsername(username) {
        return await this.userModel.findOne({ where: { username } });
    }

    async hashPassword(password) {
        return await this.bcryptService.hash(password);
    }

    async createUser(firstName, lastName, username, password) {
        const user = await this.userModel.create({
            firstName,
            lastName,
            username,
            password,
        });
        return user;
    }

    async checkPassword(password, userPassword) {
        return await this.bcryptService.compare(password, userPassword);
    }

    async generateOTP(user) {
        const otp = await this.cryptoService.createOTP();
        user.otp = otp;
        user.otpCreatedAt = Date.now();
        user.isOtpExpired = false;
        await user.save();
        return otp;
    }

    async generateToken(id) {
        const token = this.jwtService.sign(id);
        return token;
    }

    async resendOTP(user, throttleMs) {
        const createdAt = new Date(user.otpCreatedAt).getTime();
        const withinWindow = Date.now() - createdAt < throttleMs;

        if (user.otp && withinWindow && user.isOtpExpired === false) {
            return { otp: user.otp, reused: true };
        }

        const otp = await this.generateOTP(user);
        return { otp, reused: false };
    }

    async findUser({ id }) {
        return await this.userModel.findByPk(id, {
            attributes: this.SAFE_USER,
            include: [
                {
                    model: this.followModel,
                    as: "followings",
                    where: { approved: true },
                    required: false,
                    include: [
                        {
                            model: this.userModel,
                            as: "receiver",
                            attributes: this.SAFE_USER,
                        },
                    ],
                },
                {
                    model: this.followModel,
                    as: "followers",
                    where: { approved: true },
                    required: false,
                    include: [
                        {
                            model: this.userModel,
                            as: "sender",
                            attributes: this.SAFE_USER,
                        },
                    ],
                },
                "posts",
            ],
        });
    }
}
