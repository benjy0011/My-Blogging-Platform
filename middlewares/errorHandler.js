// Custome error handler middleware to render error messages
const errorHandler = (err, req, res, next) => {
    // Log the error for self reference
    console.error(err.stack);

    // Respond with the error message and a status code (default 500)
    res.status(err.status || 500).render('error', {
        message: err.message || 'Something went wrong!',
    });
};

module.exports = errorHandler;