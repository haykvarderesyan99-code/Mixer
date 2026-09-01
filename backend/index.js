import express from "express";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import loadRoutes from "./config/routes.js";
import path from "path";
import SwaggerParser from "@apidevtools/swagger-parser";
import models from "./config/database/index.js";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

if (!process.env.JWT_SECRET && process.env.NODE_ENV !== "production") {
    process.env.JWT_SECRET = "local-development-secret-change-before-deployment";
    console.warn("JWT_SECRET is not set; using a local development-only secret.");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured when NODE_ENV=production.");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 4002;
const defaultClientOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:4173",
];
const clientOrigins = (process.env.CLIENT_ORIGIN || defaultClientOrigins.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
const corsOptions = {
    origin(origin, callback) {
        if (!origin) return callback(null, true);

        if (clientOrigins.includes(origin)) return callback(null, true);

        try {
            const { hostname } = new URL(origin);
            if (hostname === "localhost" || hostname === "127.0.0.1") {
                return callback(null, true);
            }
        } catch {
            // ignore invalid origins
        }

        return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
fs.mkdirSync(path.join(__dirname, "public", "uploads"), { recursive: true });

app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.get("/health", (_req, res) => res.status(200).send({ status: "ok" }));
loadRoutes(app);

app.use((error, _req, res, _next) => {
    if (error?.name === "SequelizeUniqueConstraintError") {
        return res.status(409).send({ message: "That value is already in use." });
    }

    console.error(error);
    return res.status(500).send({ message: "An unexpected server error occurred." });
});

const openapiPath = path.join(__dirname, "docs", "openapi.yaml");
const bundledSpec = await SwaggerParser.bundle(openapiPath);

app.use("/api", swaggerUI.serve, swaggerUI.setup(bundledSpec));

// Sync database - use { force: false } in production
// Only creates tables if they don't exist
await models.sequelize.sync();

const server = http.createServer(app);

const io = new Server(server, {
    cors: corsOptions,
});

io.use((socket, next) => {
    try {
        const token =
            socket.handshake.auth && socket.handshake.auth.token
                ? String(socket.handshake.auth.token)
                : "";

        if (!token) return next(new Error("Unauthorized"));

        const secret = process.env.JWT_SECRET;
        if (!secret) return next(new Error("Server misconfigured"));

        const payload = jwt.verify(token, secret);
        const userId = payload && payload.id ? Number(payload.id) : 0;

        if (!userId) return next(new Error("Unauthorized"));

        socket.data.userId = userId;
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
});

io.on("connection", (socket) => {
    socket.on("call:join", (data) => {
        const room = String(data && data.room || "").trim();
        if (!room || room.length > 100) return;
        const safeRoom = "call:" + room.replace(/[^a-zA-Z0-9:_-]/g, "_");
        const existingPeers = io.sockets.adapter.rooms.get(safeRoom);
        socket.join(safeRoom);
        if (existingPeers && existingPeers.size > 0) {
            socket.to(safeRoom).emit("call:peer-joined", { room });
        }
    });

    socket.on("call:leave", (data) => {
        const room = String(data && data.room || "").trim();
        if (!room) return;
        socket.leave("call:" + room.replace(/[^a-zA-Z0-9:_-]/g, "_"));
    });

    for (const event of ["call:invite", "call:offer", "call:answer", "call:ice-candidate", "call:hangup"]) {
        socket.on(event, (data) => {
            const room = String(data && data.room || "").trim();
            if (!room || room.length > 100) return;
            socket.to("call:" + room.replace(/[^a-zA-Z0-9:_-]/g, "_")).emit(event, {
                ...data,
                from: Number(socket.data.userId),
            });
        });
    }

    socket.on("dm:join", (data) => {
        const chatId = data && data.chatId ? Number(data.chatId) : 0;
        if (!chatId) return;
        socket.join("chat:" + chatId);
    });

    socket.on("dm:leave", (data) => {
        const chatId = data && data.chatId ? Number(data.chatId) : 0;
        if (!chatId) return;
        socket.leave("chat:" + chatId);
    });

    socket.on("dm:message:send", async (data) => {
        try {
            const chatId = data && data.chatId ? Number(data.chatId) : 0;
            const text = String((data && data.text) || "").trim();
            const userId = Number(socket.data.userId);

            if (!chatId || !text || !userId) return;

            const member = await models.Member.findOne({
                where: { chatId, userId },
            });
            if (!member) return;

            const saved = await models.Message.create({ chatId, userId, text });

            io.to("chat:" + chatId).emit("dm:message:new", {
                id: saved.id,
                chatId: saved.chatId,
                userId: saved.userId,
                text: saved.text,
                createdAt: saved.createdAt,
            });
        } catch {
            socket.emit("dm:error", { message: "Failed to send message." });
        }
    });
});

server.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    console.log(`API documentation: http://localhost:${port}/api`);
});
