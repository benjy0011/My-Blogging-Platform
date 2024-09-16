const express = require('express');
const { createBlog, toggleLikeBlog, addCommentToBlog } = require('../controllers/blogController');
const multer = require('multer');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

// Configure Multer to store files in memory
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
    } 
});

// Route to render the create blog page
router.get('/create-blog', protect, (req, res) => {
    res.render('create-blog'); // Render the create-blog.ejs
})

// POST route for creating a new blog post, with JWT protect middleware
router.post('/create-blog', protect, upload.single('media'), createBlog);

// POST route for like post, with JWT middleware
router.post('/like-blog/:id', protect, toggleLikeBlog);

// POST route for adding a comment to a blog post, with JWT middleware
router.post('/comment-blog/:id', protect, addCommentToBlog);

module.exports = router;