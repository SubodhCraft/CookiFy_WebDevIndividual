const express = require('express');
const router = express.Router();
const {
    getLandingPageData,
    subscribeNewsletter,
    submitContactForm
} = require('../controllers/landingController');

router.get('/', getLandingPageData);
router.post('/subscribe', subscribeNewsletter);
router.post('/contact', submitContactForm);

module.exports = router;
