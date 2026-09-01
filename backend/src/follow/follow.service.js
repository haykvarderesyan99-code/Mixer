export class FollowService {
    constructor(userModel, followModel, SAFE_USER) {
        this.userModel = userModel;
        this.followModel = followModel;

        this.SAFE_USER = SAFE_USER;
    }

    async getAllRequests(to, approved = 0) {
        return await this.followModel.findAll({
            where: {
                to,
                approved,
            },
            include: {
                model: this.userModel,
                as: "sender",
                attributes: this.SAFE_USER,
            },
            attributes: ["id"],
        });
    }

    async getUser(id) {
        return await this.userModel.findByPk(id, {
            attributes: this.SAFE_USER,
        });
    }

    async getRequest(from, to) {
        return await this.followModel.findOne({ where: { from, to } });
    }

    async getRequestById(id) {
        return await this.followModel.findByPk(id);
    }

    async createRequest(from, to, approved, requested) {
        return await this.followModel.create({
            from,
            to,
            approved,
            requested,
        });
    }

    async updateRequest(id, updates) {
        const request = await this.followModel.findByPk(id);
        if (request) {
            return await request.update(updates);
        }
        return null;
    }

    async deleteRequest(id) {
        const request = await this.followModel.findByPk(id);
        if (request) {
            return await request.destroy();
        }
        return null;
    }
}
