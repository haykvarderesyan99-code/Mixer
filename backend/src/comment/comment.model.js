export default function (sequelize, DataTypes) {
    const Comment = sequelize.define("Comment", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        text: {
            type: DataTypes.STRING,
        },
        userId: {
            type: DataTypes.INTEGER,
        },
        postId: {
            type: DataTypes.INTEGER,
        },
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        Comment.belongsTo(models.Post, {
            foreignKey: "postId",
            as: "post",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        Comment.hasMany(models.CommentReaction, {
            foreignKey: "commentId",
            as: "reactions",
            onDelete: "CASCADE",
            hooks: true,
        });
    };

    return Comment;
}
