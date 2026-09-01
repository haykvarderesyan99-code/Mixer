export class CommentService {
    constructor(userModel, commentModel, commentReactionModel, SAFE_USER) {
        this.userModel = userModel;
        this.commentModel = commentModel;
        this.commentReactionModel = commentReactionModel;
        this.SAFE_USER = SAFE_USER;

        this.findPostComments = this.findPostComments.bind(this);
        this.createComment = this.createComment.bind(this);
    }

    async findPostComments(postId) {
        return await this.commentModel.findAll({
            where: {
                postId,
            },
            include: [
                {
                    model: this.userModel,
                    as: "user",
                    attributes: this.SAFE_USER,
                },
                {
                    model: this.commentReactionModel,
                    as: "reactions",
                },
            ],
        });
    }

    async createComment(postId, userId, text) {
        const comment = await this.commentModel.create({
            postId,
            userId,
            text,
        });

        await comment.reload({
            include: [
                {
                    model: this.userModel,
                    as: "user",
                    attributes: this.SAFE_USER,
                },
            ],
        });

        return comment;
    }

    async getComment(id) {
        return await this.commentModel.findByPk(id);
    }

    async getCommentReaction(commentId, userId) {
        return await this.commentReactionModel.findOne({
            where: {
                commentId,
                userId,
            },
        });
    }

    async createCommentReaction(commentId, userId) {
        return await this.commentReactionModel.create({ commentId, userId });
    }

    async deleteUserComment(comment) {
        return await comment.destroy();
    }
}
