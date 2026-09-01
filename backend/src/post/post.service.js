export class PostService {
    constructor(
        userModel,
        postModel,
        commentModel,
        postReactionModel,
        commentReactionModel,
        SAFE_USER
    ) {
        this.userModel = userModel;
        this.postModel = postModel;
        this.commentModel = commentModel;
        this.postReactionModel = postReactionModel;
        this.commentReactionModel = commentReactionModel;

        this.SAFE_USER = SAFE_USER;
    }

    async createPost(title, description, authorId, postImage, tags, location) {
        return await this.postModel.create({
            title,
            description,
            authorId,
            postImage,
            tags,
            location,
        });
    }

    async findPost(id) {
        return await this.postModel.findOne({ where: { id } });
    }

    async getPostInformation(id) {
        return await this.postModel.findByPk(id, {
            include: [
                {
                    model: this.userModel,
                    as: "author",
                    attributes: this.SAFE_USER,
                },
                {
                    model: this.commentModel,
                    as: "postComments",
                    include: [
                        {
                            model: this.userModel,
                            as: "user",
                            attributes: this.SAFE_USER,
                        },
                        {
                            model: this.commentReactionModel,
                            as: "reactions",
                            include: {
                                model: this.userModel,
                                as: "user",
                                attributes: this.SAFE_USER,
                            },
                        },
                    ],
                },
                {
                    model: this.postReactionModel,
                    as: "postReactions",
                    include: {
                        model: this.userModel,
                        as: "reactedBy",
                        attributes: this.SAFE_USER,
                    },
                },
            ],
        });
    }

    async findReaction(userId, postId) {
        return await this.postReactionModel.findOne({
            where: { userId, postId },
        });
    }

    async createReaction(userId, postId) {
        const reaction = await this.postReactionModel.create({
            postId,
            userId,
        });

        return await reaction.reload({
            include: {
                model: this.userModel,
                as: "reactedBy",
                attributes: this.SAFE_USER,
            },
        });
    }

    async findAllReactions(postId) {
        return await this.postReactionModel.findAll({
            where: {
                postId,
            },
        });
    }

    async deletePost(post) {
        return await post.destroy();
    }
}
