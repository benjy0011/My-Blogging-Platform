// Import libraries
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from the .env file

// Import route files
const authRoutes = require('./routes/auth');
const mainRoutes = require('./routes/main');
const blogRoutes = require('./routes/blog');
const errorHandler = require('./middlewares/errorHandler'); // error handler middleware

// Initialize the Express app
const app = express();

// Middleware to handle from data (URL-encoded and JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MIddleware to parse cookies in incoming requests
app.use(cookieParser());

// Set EJS as the view enginer for rendering dynamic HTML pages
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define the root route and redirect to /main
app.get('/', (req, res) => {
    res.redirect('/main');  // Redirect to the main page
});

app.get('/terms', (req, res) => {
    res.render('terms');  
});

// Routes
app.use(authRoutes);
app.use(mainRoutes);
app.use(blogRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
