export default function (sequelize, DataTypes) {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            firstName: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            lastName: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isAccountPrivate: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            otp: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isOtpExpired: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            otpCreatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            isSigninAllowed: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            avatar: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            bio: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            theme: {
                type: DataTypes.ENUM("system", "light", "dark"),
                allowNull: false,
                defaultValue: "system",
            },
        },
        {
            paranoid: true,
            deletedAt: "deletedAt",
        }
    );

    User.associate = (models) => {
        User.hasMany(models.Follow, { foreignKey: "from", as: "followings" });
        User.hasMany(models.Follow, { foreignKey: "to", as: "followers" });
        User.hasMany(models.Post, { foreignKey: "authorId", as: "posts" });
    };

    return User;
}
