export class AccountService {
    constructor(
        userModel,
        followModel,
        postModel,
        commentModel,
        postReactionModel,
        bcryptService,
        chatService,
        sequelize,
        Op,
        SAFE_USER
    ) {
        this.userModel = userModel;
        this.followModel = followModel;
        this.postModel = postModel;
        this.commentModel = commentModel;
        this.postReactionModel = postReactionModel;
        this.bcryptService = bcryptService;
        this.chatService = chatService;
        this.sequelize = sequelize;
        this.Op = Op;
        this.SAFE_USER = SAFE_USER;

        this.deleteUserAccount = this.deleteUserAccount.bind(this);
    }

    async findUser(params) {
        return await this.userModel.findOne({
            where: params,
            attributes: this.SAFE_USER,
            paranoid: false,
            include: [
                {
                    model: this.followModel,
                    as: "followings",
                    where: { approved: true },
                    required: false,
                    include: [
                        {
                            model: this.userModel,
                            as: "receiver",
                            attributes: this.SAFE_USER,
                        },
                    ],
                },
                {
                    model: this.followModel,
                    as: "followers",
                    where: { approved: true },
                    required: false,
                    include: [
                        {
                            model: this.userModel,
                            as: "sender",
                            attributes: this.SAFE_USER,
                        },
                    ],
                },
                {
                    model: this.postModel,
                    as: "posts",
                    include: [
                        {
                            model: this.commentModel,
                            as: "postComments",
                            attributes: ["id"],
                        },
                                {
                                    model: this.postReactionModel,
                                    as: "postReactions",
                                    attributes: ["id", "userId"],
                                },
                    ],
                },
            ],
        });
    }

    async findUserWithPassword(params) {
        return await this.userModel.findOne({
            where: params,
            attributes: [...this.SAFE_USER, "password"],
            paranoid: false,
        });
    }

    async getRelationshipStatus(currentUserId, targetUserId) {
        if (!currentUserId) {
            return {
                requestSent: false,
                followStatus: false,
                followsMe: false
            };
        }

        // Check if current user sent a pending request to target user
        const sentRequest = await this.followModel.findOne({
            where: {
                from: currentUserId,
                to: targetUserId,
                approved: false
            }
        });

        // Check if current user follows target user
        const followStatus = await this.followModel.findOne({
            where: {
                from: currentUserId,
                to: targetUserId,
                approved: true
            }
        });

        // Check if target user follows current user
        const followsMe = await this.followModel.findOne({
            where: {
                from: targetUserId,
                to: currentUserId,
                approved: true
            }
        });

        return {
            requestSent: !!sentRequest,
            followStatus: !!followStatus,
            followsMe: !!followsMe
        };
    }

    async findAllUsers(text) {
        return await this.userModel.findAll({
            where: {
                firstName: {
                    [this.Op.like]: `${text}%`,
                },
            },
            attributes: this.SAFE_USER,
        });
    }

    async changePrivacy(id) {
        const user = await this.findUser({ id });
        user.isAccountPrivate = 1 - user.isAccountPrivate;
        return await user.save();
    }

    async checkPassword(currentPass, pass) {
        return await this.bcryptService.compare(currentPass, pass);
    }

    async hashPassword(password) {
        return await this.bcryptService.hash(password);
    }

    async setBio(id, bio) {
        return await this.userModel.update({ bio }, { where: { id } });
    }

    async setTheme(id, theme) {
        return await this.userModel.update({ theme }, { where: { id } });
    }

    async deleteUserAccount(userId) {
        return await this.sequelize.transaction(async (t) => {
            const user = await this.userModel.findOne({
                where: { id: userId },
                attributes: ["username", "firstName", "lastName"],
                transaction: t,
                paranoid: false,
            });

            if (!user) return null;

            const { username, firstName, lastName } = user;

            await this.chatService.cleanupChatsForDeletedUser(userId, t);

            await this.followModel.destroy({
                where: {
                    [this.Op.or]: [{ from: userId }, { to: userId }],
                },
                transaction: t,
            });

            await this.userModel.destroy({
                where: { id: userId },
                transaction: t,
            });

            return { username, firstName, lastName };
        });
    }
}
