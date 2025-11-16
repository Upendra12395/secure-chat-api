const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Conversation = sequelize.define(
        "Conversation",
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            participantAId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                field: "participant_a_id",
            },
            participantBId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                field: "participant_b_id",
            },
            startedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                field: "started_at",
            },
        },
        {
            tableName: "conversations",
            timestamps: false,
        }
    );

    return Conversation;
};
