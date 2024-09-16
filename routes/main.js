const express = require('express');
const { renderNextBlog, renderLatestBlog } = require('../controllers/mainController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

// GET route for the main page, with JWT protect middlware
router.get('/main', protect, renderLatestBlog);

// GET route to render the next blog post
router.get('/main/next/:lastBlogId', protect, renderNextBlog);

module.exports = router;