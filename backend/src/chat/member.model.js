export default function (sequelize, DataTypes) {
    const Member = sequelize.define("Member", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        chatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        lastReadAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });

    Member.associate = (models) => {
        Member.belongsTo(models.Chat, {
            foreignKey: "chatId",
            as: "chat",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        Member.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        });
    };

    Member.addHook("afterDestroy", async (member, options) => {
        const { Member: MemberModel, Chat } = sequelize.models;

        const remaining = await MemberModel.count({
            where: { chatId: member.chatId },
            transaction: options.transaction,
        });

        if (remaining === 0) {
            await Chat.destroy({
                where: { id: member.chatId },
                transaction: options.transaction,
                individualHooks: true,
            });
        }
    });

    return Member;
}
