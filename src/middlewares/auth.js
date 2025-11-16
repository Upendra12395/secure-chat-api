const jwtService = require('../services/jwt');

module.exports = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Unauthorized' });
    const token = auth.split(' ')[1];
    try {
        const payload = jwtService.verifyAccess(token);
        req.user = { id: payload.sub };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
