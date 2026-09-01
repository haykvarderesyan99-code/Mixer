export class PostController {
    constructor(service) {
        this.service = service;

        this.createNewPost = this.createNewPost.bind(this);
        this.getPostInfo = this.getPostInfo.bind(this);
        this.like = this.like.bind(this);
        this.getAllLikes = this.getAllLikes.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    async createNewPost(req, res) {
        const { title, description, location, tags } = req.body;
        const { id } = req.user;
        const postImage = req.file ? req.file.filename : null;

        // Parse tags if it's a string
        const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

        const newPost = await this.service.createPost(
            title,
            description,
            id,
            postImage,
            parsedTags,
            location
        );
        const postInfo = await this.service.findPost(newPost.id);

        return res.status(201).send({ postInfo });
    }

    async getPostInfo(req, res) {
        const { postId } = req.params;
        const postInfo = await this.service.getPostInformation(postId);
        return res.status(200).send({ postInfo });
    }

    async deletePost(req, res) {
        await this.service.deletePost(req.post);
        return res.status(200).send({ message: "Post deleted successfully" });
    }

    async like(req, res) {
        const { id } = req.user;
        const { postId } = req.params;
        const reaction = await this.service.createReaction(id, postId);
        return res.status(200).send({ reactionStatus: true, reaction });
    }

    async getAllLikes(req, res) {
        const { postId } = req.params;
        const reactions = await this.service.findAllReactions(postId);
        return res.status(200).send({ reactions });
    }
}
