const express = require('express');
const { login, signup, logout } = require('../controllers/authController');

const router = express.Router();

// GET route for rendering the login/signup page
router.get('/login', (req, res) => {
    res.render('auth');  // Render the auth.ejs view
});

// POST route for logging in a user
router.post('/login', login);

// POST route for signing up a new user
router.post('/signup', signup);

// GET route for logging out
router.get('/logout', logout);

module.exports = router;