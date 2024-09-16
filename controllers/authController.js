const { auth } = require('../config/firebase');
const { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } = require('firebase/auth');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// Function to generate a JWT token for a logged in user
const generateToken = (user) => {
    // Sign the token with the user's uid and email, using the JWT secret, and set an expiration of 1 day
    return jwt.sign({ 
        uid: user.uid, 
        email: user.email,
        name: user.displayName
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Login controller that authenticates a user and issues a JWT
const login = asyncHandler(async (req, res) => {
    const { email, password, remember } = req.body;

    try {
        // Firebase login with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get the latest profile info
        await user.reload();

        // 'Remember me' for storing the user credential in cookies
        const tokenExpiration = remember ? '7d' : '1d';

        // Generate a JWT token for the logged-in user
        const token = generateToken(user, tokenExpiration);

        // Set the token in a cookie
        res.cookie('auth_token', token, {
            httpOnly: true, // Make the cookie HTTP-only for security
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: remember? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // Set cookie based on 'Remember me'
        });

        // Redirect to the main page after successful login
        res.redirect('/main');
    } catch (error) {
        console.log(error);
        res.render('auth', {
            errorMessage: 'Invalid email or password. Please try again.'
        });
    }
});

// Signup controller to create a new user and issue a JWT
const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Firebase sign up with email and password
    // password[1] to get confirm password as final password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password[1]);

    // Update the user's profile with their name
    await updateProfile(userCredential.user, {
        displayName: name // Set the user's display name to the name provided in the form
    });

    // Generate a JWT token for the new user
    const token = generateToken(userCredential.user);
    
    // Set the token in a cookie
    res.cookie('auth_token', token, {
        httpOnly: true, // Make the cookie HTTP-only for security
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000 // Set expiration for 1 day
    });

    // Redirect to the main page after successful sign up
    res.redirect('/main')
});

// Logout controller
const logout = asyncHandler(async (req, res) => {
    // Clear the auth_token cookie to log out
    res.clearCookie('auth_token');

    // Log out from firebase
    await signOut(auth);

    // Redirect to the login page
    res.redirect('/login');
})

module.exports = { login, signup, logout };