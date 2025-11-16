const winston = require("winston");

const createLogger = () => {
    const isDev = process.env.NODE_ENV === "development";

    return winston.createLogger({
        level: isDev ? "debug" : "info",

        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),

            isDev
                ? winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
                : winston.format.json()
        ),

        transports: [
            new winston.transports.Console(),
            ...(!isDev
                ? [
                    new winston.transports.File({
                        filename: "logs/error.log",
                        level: "error",
                    }),
                    new winston.transports.File({
                        filename: "logs/combined.log",
                    }),
                ]
                : []),
        ],
    });
};

const logger = createLogger();

module.exports = logger;