export class FollowController {
    constructor(service) {
        this.service = service;

        this.getRequests = this.getRequests.bind(this);
        this.acceptRequest = this.acceptRequest.bind(this);
        this.declineRequest = this.declineRequest.bind(this);
        this.follow = this.follow.bind(this);
    }

    async getRequests(req, res) {
        const requests = await this.service.getAllRequests(req.user.id);
        return res.status(200).send({ requests });
    }

    async acceptRequest(req, res) {
        const { id } = req.params;
        const userId = req.user.id;
        
        // Get the request and verify it belongs to the logged-in user
        const request = await this.service.getRequestById(id);
        
        if (!request) {
            return res.status(404).send({ message: "Follow request not found" });
        }
        
        if (request.to !== userId) {
            return res.status(403).send({ message: "Unauthorized to accept this request" });
        }
        
        if (request.approved) {
            return res.status(400).send({ message: "Request already accepted" });
        }
        
        // Update the request to approved
        await this.service.updateRequest(id, { approved: true });
        
        return res.status(200).send({ message: "Follow request accepted" });
    }

    async declineRequest(req, res) {
        const { id } = req.params;
        const userId = req.user.id;
        
        // Get the request and verify it belongs to the logged-in user
        const request = await this.service.getRequestById(id);
        
        if (!request) {
            return res.status(404).send({ message: "Follow request not found" });
        }
        
        if (request.to !== userId) {
            return res.status(403).send({ message: "Unauthorized to decline this request" });
        }
        
        // Delete the request
        await this.service.deleteRequest(id);
        
        return res.status(200).send({ message: "Follow request declined" });
    }

    async follow(req, res) {
        const { id: to } = req.params;
        const { id: from } = req.user;
        
        // Note: The validator already handles private accounts and only passes
        // public accounts to this controller. This method is only called for
        // public accounts that the user is not already following.
        const result = await this.service.createRequest(from, to, true, false);
        return res.status(200).send({ status: "Followed", result });
    }
}
