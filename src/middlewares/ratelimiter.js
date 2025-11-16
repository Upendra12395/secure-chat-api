const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS),
    max: process.env.RATE_LIMIT_MAX,
    message:{
        "error" : "Too Many requests",
        message: "Too many requests for this ip. please try after some time",
        retryAfter:Math.ceil(process.env.RATE_LIMIT_WINDOW_MS/1000)
    },
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = rateLimiter;