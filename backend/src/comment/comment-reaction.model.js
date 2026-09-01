export default function (sequelize, DataTypes) {
    const CommentReaction = sequelize.define("CommentReaction", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: DataTypes.INTEGER,
        commentId: DataTypes.INTEGER,
    });

    CommentReaction.associate = (models) => {
        CommentReaction.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user",
            onDelete: "CASCADE",
        });
        CommentReaction.belongsTo(models.Comment, {
            foreignKey: "commentId",
            as: "comment",
        });
    };

    return CommentReaction;
}
