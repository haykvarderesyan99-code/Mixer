import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = (service, req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send({ message: "Unauthorized" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).send({ message: "Server authentication is not configured" });
    }

    jwt.verify(token, secret, async (err, payload) => {
        if (err || !payload?.id) {
            return res.status(403).send({ message: "Forbidden" });
        }

        const user = await service.findUser({ id: payload.id });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        req.user = user;
        next();
    });
};
