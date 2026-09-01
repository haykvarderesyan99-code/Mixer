export class JWTService {
    constructor(jwt) {
        this.jwt = jwt;
    }

    async sign(id) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not configured");
        }

        return this.jwt.sign({ id }, secret, {
            expiresIn: "1h",
        });
    }
}
