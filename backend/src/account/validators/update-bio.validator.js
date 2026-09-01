export default async function updateBioValidator(req, res, next) {
    const { bio } = req.body;

    if (bio.length > 150) {
        return res.status(400).send({ message: "Bio too long" });
    }

    return next();
}
