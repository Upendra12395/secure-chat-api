const express = require('express');
const router = express.Router();

const authRoutes = require("./v1/auth");
const userRoutes = require("./v1/users");

router.use("/v1/users", userRoutes);

router.use("/v1/auth", authRoutes);

module.exports = router;