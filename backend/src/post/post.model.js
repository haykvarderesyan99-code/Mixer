export default function (sequelize, DataTypes) {
    const Post = sequelize.define("Post", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        authorId: {
            type: DataTypes.INTEGER,
        },
        title: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        postImage: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        tags: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
        location: {
            type: DataTypes.STRING,
        },
    });

    Post.associate = (models) => {
        Post.belongsTo(models.User, {
            foreignKey: "authorId",
            as: "author",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        Post.hasMany(models.Comment, {
            foreignKey: "postId",
            as: "postComments",
            onDelete: "CASCADE",

            hooks: true,
        });
        Post.hasMany(models.PostReaction, {
            foreignKey: "postId",
            as: "postReactions",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            hooks: true,
        });
    };

    return Post;
}
