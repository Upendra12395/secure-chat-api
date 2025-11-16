const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Message = sequelize.define(
        "Message",
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            senderId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                field: "sender_id",
            },
            receiverId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                field: "receiver_id",
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            timestamp: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "messages",
            timestamps: false,
        }
    );

    return Message;
};
