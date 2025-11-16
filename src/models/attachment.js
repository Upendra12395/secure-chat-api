const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Attachment = sequelize.define(
        "Attachment",
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            messageId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                field: "message_id",
            },
            fileType: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fileUrl: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "file_url",
            },
            uploadedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                field: "uploaded_at",
            },
        },
        {
            tableName: "attachments",
            timestamps: false,
        }
    );

    return Attachment;
};
