export default function (sequelize, DataTypes) {
    const PostReaction = sequelize.define("PostReaction", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        postId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
    });

    PostReaction.associate = (models) => {
        PostReaction.belongsTo(models.User, {
            foreignKey: "userId",
            as: "reactedBy",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    };
    return PostReaction;
}
