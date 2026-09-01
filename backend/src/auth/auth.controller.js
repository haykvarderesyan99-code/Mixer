export class AuthController {
    constructor(authService) {
        this.authService = authService;

        this.getUser = this.getUser.bind(this);
        this.signup = this.signup.bind(this);
        this.signin = this.signin.bind(this);
    }

    async signup(req, res) {
        const { firstName, lastName, username, password } = req.body;
        await this.authService.createUser(
            firstName,
            lastName,
            username,
            password
        );

        return res
            .status(201)
            .send({ message: `${username} has signed up successfully!` });
    }

    async signin(req, res) {
        const user = req.user;
        const token = await this.authService.generateToken(user.id);
        return res.status(200).send({
            message: "Signed in successfully!",
            token,
            endpoint: "/profile",
        });
    }

    async getUser(req, res) {
        const user = await this.authService.findUser({ id: req.user.id });
        return res.status(200).send({ user });
    }
}
