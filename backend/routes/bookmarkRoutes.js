const express = require('express');
const router = express.Router();
const { toggleBookmark, getMyBookmarks, checkBookmark } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

// All bookmark routes are protected
router.use(protect);

router.post('/toggle/:recipeId', toggleBookmark);
router.get('/', getMyBookmarks);
router.get('/check/:recipeId', checkBookmark);

module.exports = router;
