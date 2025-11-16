const express = require('express');
const router = express.Router();
const userCtrl = require('../../controllers/user');
const authMiddleware = require('../../middlewares/auth');
const uploadDisk = require('../../services/multer');

router.use(authMiddleware);
router.delete('/:id/profile-pictures/:pictureId', userCtrl.deleteProfilePicture);
router.patch('/:id/profile-pictures/:pictureId/default', userCtrl.setDefaultProfilePicture);
router.post('/:id/profile-pictures', uploadDisk.array('pictures', 10), userCtrl.uploadProfilePictures);

module.exports = router;