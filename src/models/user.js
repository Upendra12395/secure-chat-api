const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
            },
            isVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                field: "is_verified",
            },
            profilePicture: {
                type: DataTypes.STRING,
                field: "profile_picture",
            },
        },
        {
            tableName: "users",
            timestamps: false,
        }
    );

    return User;
};