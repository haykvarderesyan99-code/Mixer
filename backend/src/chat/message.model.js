export default function (sequelize, DataTypes) {
    const Message = sequelize.define(
        "Message",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            chatId: { type: DataTypes.INTEGER, allowNull: false },
            userId: { type: DataTypes.INTEGER, allowNull: false },
            text: { type: DataTypes.STRING, allowNull: false },
            deletedAt: { type: DataTypes.DATE, allowNull: true },
        },
        {
            paranoid: true,
        }
    );

    Message.associate = (models) => {
        Message.belongsTo(models.Chat, { foreignKey: "chatId" });
        Message.belongsTo(models.User, { foreignKey: "userId", as: "sender" });
    };

    return Message;
}
