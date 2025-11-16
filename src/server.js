require('dotenv').config();
const http = require('http');
const app = require('./app');
const socketInit = require('./sockets/socket');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected');
        // optionally run migrations/seeds here or in CI
        socketInit(server); // attach socket.io
        server.listen(PORT, () => console.log(`Server running on ${PORT}`));
    } catch (err) {
        console.error('Failed to start', err);
        process.exit(1);
    }
})();
