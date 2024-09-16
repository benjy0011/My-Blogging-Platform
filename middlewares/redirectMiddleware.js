// Not implementing


// Middleware to add '/my-blogging-platform' prefix to all redirects
const redirectPrefix = (req, res, next) => {
    res.oldRedirect = res.redirect; // Save the original redirect function
    res.redirect = (url) => { // Override redirect to add base path
        if (!url.startsWith('/my-blogging-platform')) {
            url = '/my-blogging-platform' + url; // Prepend prefix
        }
        res.oldRedirect(url); // Call the original redirect function
    };
    next();
};

module.exports = redirectPrefix;