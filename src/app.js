const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
// const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const requestLogger = require('./middlewares/requestLogger');
const routes = require('./routes');
const errorHandler = require('./middlewares/error');
const { createSuccessResponse } = require('./utils/response');

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
// app.use(xss());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined'));

const db = require("./models"); // <-- loads index.js which loads all models
const sequelize = db.sequelize;
sequelize.sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch(err => console.error("Sync error:", err));

const limiter = require('./middlewares/rateLimiter');
app.use(limiter);
app.use(requestLogger);
app.get('/health', (req, res) => res.json(createSuccessResponse({ status: 'ok' })));

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;
