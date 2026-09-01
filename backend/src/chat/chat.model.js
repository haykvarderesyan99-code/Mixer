export default function (sequelize, DataTypes) {
    const Chat = sequelize.define("Chat", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    });

    Chat.associate = (models) => {
        Chat.hasMany(models.Member, {
            foreignKey: "chatId",
            as: "members",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            hooks: true,
        });

        Chat.hasMany(models.Message, {
            foreignKey: "chatId",
            as: "messages",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            hooks: true,
        });
    };

    return Chat;
}
