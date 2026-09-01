import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

transporter
    .verify()
    .then(() => console.log("Email transporter ready"))
    .catch((err) => console.error("Email transporter error:", err.message));

export async function sendEmail(to, subject, text) {
    try {
        await transporter.sendMail({
            from: `"Lyncora" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            text,
        });
    } catch (err) {
        console.error("Email send failed:", err.message);
    }
}
