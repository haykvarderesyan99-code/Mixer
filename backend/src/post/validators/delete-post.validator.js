export default async function deletePostValidator(service, req, res, next) {
    const { postId } = req.params;
    const post = await service.findPost(postId);

    if (!post) {
        return res.status(404).send({ message: "Post not found" });
    }

    if (Number(post.authorId) !== Number(req.user.id)) {
        return res.status(403).send({ message: "Forbidden" });
    }

    req.post = post;
    return next();
}
