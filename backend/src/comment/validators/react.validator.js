export default async function reactValidator(service, req, res, next) {
    const { commentId } = req.params;
    const userId = req.user.id;

    const found = await service.getCommentReaction(commentId, userId);

    if (found) {
        await found.destroy();
        return res.status(200).send({ commentReactionStatus: false });
    }

    return next();
}
