import { authRouter } from "../src/auth/auth.router.js";
import { accountRouter } from "../src/account/account.router.js";
import { followRouter } from "../src/follow/follow.router.js";
import { postRouter } from "../src/post/post.router.js";
import { commentRouter } from "../src/comment/comment.router.js";
import { chatRouter } from "../src/chat/chat.router.js";

export default function (app) {
    app.use('/auth', authRouter);
    app.use('/account', accountRouter);
    app.use('/follow', followRouter);
    app.use('/posts', postRouter);
    app.use("/posts/:postId/comments", commentRouter);
    app.use("/chats", chatRouter);
}