const logger = require('../utils/logger');

const errorHandler = (error,req,res,next)=>{
    logger.error('Unhandled error:',{
        error:error.message,
        stack:error.stack,
        url:req.url,
        method:req.method,
        ip:req.ip
    });

    res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
        timestamp: new Date().toISOString()
    })
}

module.exports = errorHandler;