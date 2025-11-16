const logger = require('../utils/logger');

const requestLogger = (req,res,next)=>{
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip
        };

        if (res.statusCode >= 400) {
            logger.warn('Request completed with error', logData);
            return;
        }else {
            logger.info('Request completed', logData);
        }
    });

    next();
}

module.exports = requestLogger;