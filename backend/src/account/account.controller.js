export class AccountController {
    constructor(service) {
        this.service = service;

        this.getUserInfo = this.getUserInfo.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.setAccountPrivacy = this.setAccountPrivacy.bind(this);
        this.handleAvatarUpload = this.handleAvatarUpload.bind(this);
        this.updateBio = this.updateBio.bind(this);
        this.updateTheme = this.updateTheme.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    async getUserInfo(req, res) {
        const { username } = req.params;
        const user = await this.service.findUser({ username });
        
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const currentUserId = req.user?.id;
        const relationship = await this.service.getRelationshipStatus(
            currentUserId,
            user.id
        );

        const userObj = user.toJSON();
        if (userObj.posts && Array.isArray(userObj.posts)) {
            userObj.posts = userObj.posts.map((p) => {
                const likesCount = p.postReactions ? p.postReactions.length : 0;
                const commentsCount = p.postComments ? p.postComments.length : 0;
                const likedByMe = currentUserId
                    ? !!(p.postReactions || []).find((r) => r.userId === currentUserId)
                    : false;
                const { postReactions, postComments, ...rest } = p;
                return { ...rest, likesCount, commentsCount, likedByMe };
            });
        }

        return res.status(200).send({
            user: userObj,
            ...relationship,
        });
    }

    async searchUsers(req, res) {
        const { text } = req.params;
        const users = await this.service.findAllUsers(text);
        return res.status(200).send({ users });
    }

    async setAccountPrivacy(req, res) {
        const { id } = req.user;
        const user = await this.service.changePrivacy(id);
        return res
            .status(200)
            .send({ isAccountPrivate: user.isAccountPrivate });
    }

    async changeUserEmail(req, res) {
        return res.status(200).send({ message: "Email changed successfully!" });
    }

    async changeUserPassword(req, res) {
        return res
            .status(200)
            .send({ message: "Your password has been changed successfully" });
    }

    async handleAvatarUpload(req, res) {
        const user = await this.service.findUser({ id: req.user.id });
        user.avatar = req.file.filename;
        await user.save();
        return res.status(200).send({ picture: req.file.filename });
    }

    async updateBio(req, res) {
        const { id } = req.user;
        const { bio } = req.body;

        await this.service.setBio(id, bio);
        return res
            .status(200)
            .send({ bio, message: "Bio updated successfully!" });
    }

    async updateTheme(req, res) {
        const { id } = req.user;
        const { theme } = req.body;

        await this.service.setTheme(id, theme);
        return res.status(200).send({ theme });
    }

    async deleteAccount(req, res) {
        return res.status(200).send({ message: "Account deleted" });
    }
}
