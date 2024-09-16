const jwt = require('jsonwebtoken');

// Middleware to protect routes by validating the JWT token from cookies
const protect = (req, res, next) => {
    // Retrieve token from the auth_token cookie
    const token = req.cookies.auth_token;

    // If no token is found, redirect the user tp the login page
    if(!token) {
        return res.redirect('/login');
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to req.user
        req.user = {
            uid: decoded.uid,
            email: decoded.email,
            name: decoded.name 
        };

        next();
    } catch (error) {
        res.redirect('/login');
    }
};

module.exports = protect;