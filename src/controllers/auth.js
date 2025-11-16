const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwtService = require('../services/jwt');
const { v4: uuidv4 } = require("uuid");
const { validatePassword } = require('../utils/validator');
const { createSuccessResponse, createErrorResponse } = require('../utils/response');

exports.register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json(createErrorResponse({ error: 'Email already in use' }));
        }
        if (!email || !password) {
            return res.status(400).json(createErrorResponse({ error: 'Email and password are required' }));
        }
        if (!name) {
            return res.status(400).json(createErrorResponse({ error: 'Name is required' }));
        }
        let { valid, errors } = validatePassword(password);
        if (!valid) {
            return res.status(400).json(createErrorResponse({ error: 'Invalid password', details: errors }));
        }
        const hashed = await bcrypt.hash(password, 12);
        const user = await User.create({ email, password: hashed, name });
        return res.status(201).json(createSuccessResponse({ id: user.id, email: user.email, name: user.name }));
    } catch (err) {
        next(err);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        // Verify token logic here
        return res.json(createSuccessResponse({ ok: true, message: 'Email verified (demo)' }));
    } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json(createSuccessResponse({ error: 'Invalid credentials' }));
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json(createSuccessResponse({ error: 'Invalid credentials' }));

        const accessToken = jwtService.signAccess({ sub: user.id });
        const refreshToken = jwtService.signRefresh({ sub: user.id, tid: uuidv4() });

        // Persist refresh token identifier in DB/Redis (for rotation & blacklist)
        // Example return tokens as HttpOnly cookies:
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' });
        return res.json(createSuccessResponse({ accessToken, user: { id: user.id, email: user.email } }));
    } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;
        if (!token) return res.status(401).json(createErrorResponse({ error: 'No refresh token' }));

        const payload = jwtService.verifyRefresh(token);

        const newAccess = jwtService.signAccess({ sub: payload.sub });
        const newRefresh = jwtService.signRefresh({ sub: payload.sub, tid: uuidv4() });

        // blacklist old refresh / store new
        res.cookie('refreshToken', newRefresh, { httpOnly: true, sameSite: 'strict' });
        return res.json(createSuccessResponse({ accessToken: newAccess }));
    } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            // blacklist token in Redis
        }
        res.clearCookie('refreshToken');
        return res.json(createSuccessResponse({ ok: true }));
    } catch (err) { next(err); }
};
