export const signupPipe = async (bcryptService, req, res, next) => {
    req.body.password = await bcryptService.hash(req.body.password);
    return next();
};
