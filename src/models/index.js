const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const sequelizeConfig = require('../config/sequelize-config');

const sequelize = new Sequelize(
    sequelizeConfig[process.env.NODE_ENV || 'development'].database,
    sequelizeConfig[process.env.NODE_ENV || 'development'].username,
    sequelizeConfig[process.env.NODE_ENV || 'development'].password,
    {
        host: sequelizeConfig[process.env.NODE_ENV || 'development'].host,
        dialect: sequelizeConfig[process.env.NODE_ENV || 'development'].dialect,
        logging: false,
    }
);

const db = { sequelize, Sequelize };

fs.readdirSync(__dirname)
    .filter(f => f.endsWith('.js') && f !== 'index.js')
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

const { User, Conversation, Message, Attachment } = db;

if (Conversation && Message) {
    Conversation.hasMany(Message, { foreignKey: "conversation_id" });
    Message.belongsTo(Conversation, { foreignKey: "conversation_id" });

    User.hasMany(Message, { foreignKey: "sender_id" });
    Message.belongsTo(User, { foreignKey: "sender_id" });
}

if (Message && Attachment) {
    Message.hasMany(Attachment, { foreignKey: "message_id" });
    Attachment.belongsTo(Message, { foreignKey: "message_id" });
}


module.exports = db;
