import UserModel from "../../src/auth/auth.model.js";
import FollowModel from "../../src/follow/follow.model.js";
import PostModel from "../../src/post/post.model.js";
import PostReactionModel from "../../src/post/post-reaction.model.js";
import CommentModel from "../../src/comment/comment.model.js";
import CommentReactionModel from "../../src/comment/comment-reaction.model.js";
import ChatModel from "../../src/chat/chat.model.js";
import MemberModel from "../../src/chat/member.model.js";
import MessageModel from "../../src/chat/message.model.js";
import { sequelize } from "./database.config.js";
import { DataTypes } from "sequelize";

const models = {};

models.sequelize = sequelize;
models.User = UserModel(sequelize, DataTypes);
models.Follow = FollowModel(sequelize, DataTypes);
models.Post = PostModel(sequelize, DataTypes);
models.PostReaction = PostReactionModel(sequelize, DataTypes);
models.Comment = CommentModel(sequelize, DataTypes);
models.CommentReaction = CommentReactionModel(sequelize, DataTypes);
models.Chat = ChatModel(sequelize, DataTypes);
models.Member = MemberModel(sequelize, DataTypes);
models.Message = MessageModel(sequelize, DataTypes);

Object.values(models).forEach((model) => {
    if (model && typeof model.associate === "function") {
        model.associate(models);
    }
});

export default models;
