const { User } = require('../models');
const { uploadToS3, deleteFromS3 } = require('../services/storage');
const { createSuccessResponse, createErrorResponse } = require('../utils/response');

const uploadProfilePictures = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json(createErrorResponse({ error: "User not found" }));

        if (!req.files || req.files.length === 0) {
            return res.status(400).json(createErrorResponse({ error: "No files uploaded" }));
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            const result = await uploadToS3(file, process.env.AWS_BUCKET);
            let url = result.url;
            uploadedFiles.push(url);
        }

        // Set LAST uploaded as default profile picture
        user.profilePicture = uploadedFiles[uploadedFiles.length - 1];
        await user.save();

        return res.json(createSuccessResponse({
            message: "Uploaded successfully",
            uploaded: uploadedFiles,
            defaultPicture: user.profilePicture,
        }));
    } catch (err) {
        console.error(err);
        return res.status(500).json(createErrorResponse({ error: "Server error" }));
    }
};

const setDefaultProfilePicture = async (req, res) => {
    try {
        const { id, pictureId } = req.params;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json(createErrorResponse({ error: "User not found" }));

        // pictureId should be S3 URL
        user.profilePicture = decodeURIComponent(pictureId);
        await user.save();

        return res.json(createSuccessResponse({ message: "Default profile picture updated", url: user.profilePicture }));
    } catch (err) {
        console.error(err);
        return res.status(500).json(createErrorResponse({ error: "Server error" }));
    }
};

const deleteProfilePicture = async (req, res) => {
    try {
        const { id, pictureId } = req.params;
        const decodedUrl = decodeURIComponent(pictureId);

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json(createErrorResponse({ error: "User not found" }));

        // Extract S3 key
        const key = decodedUrl.split("/").pop();

        await deleteFromS3(process.env.AWS_BUCKET, key);

        // If this is the same as user's active picture → remove
        if (user.profilePicture === decodedUrl) {
            user.profilePicture = null;
            await user.save();
        }

        return res.json(createSuccessResponse({ message: "Picture deleted successfully" }));
    } catch (err) {
        console.error(err);
        return res.status(500).json(createErrorResponse({ error: "Server error" }));
    }
};

module.exports = {
    uploadProfilePictures,
    setDefaultProfilePicture,
    deleteProfilePicture
};
