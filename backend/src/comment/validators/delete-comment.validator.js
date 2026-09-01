export default async function deleteCommentValidator(service, req, res, next) {
    const { commentId } = req.params;

    const comment = await service.getComment(commentId);
    if (!comment) {
        return res.status(404).send({ message: "Comment not found..." });
    }

    if (Number(comment.userId) !== Number(req.user.id)) {
        return res.status(403).send({ message: "Forbidden" });
    }

    req.comment = comment;
    return next();
}
