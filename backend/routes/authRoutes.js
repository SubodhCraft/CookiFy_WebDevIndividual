const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, updateProfilePicture } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/profileMulter');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/update-profile-picture', protect, upload.single('profilePicture'), updateProfilePicture);

module.exports = router;
