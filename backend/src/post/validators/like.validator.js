export default async function likeValidator(service, req, res, next) {
    const { id } = req.user;
    const { postId } = req.params;

    const found = await service.findReaction(id, postId);

    if (found) {
        await found.destroy();
        return res.send({ reactionStatus: false });
    }

    return next();
}
