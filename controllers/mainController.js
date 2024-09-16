const { collection, getDocs, query, orderBy, limit, doc, startAfter, getDoc } = require("firebase/firestore");
const { db } = require("../config/firebase");
const asyncHandler = require("express-async-handler");

// Controller to render the main page with the latest blog post
const renderLatestBlog = asyncHandler(async (req, res) => {
    // Query to get the latest blog post ordered by creation date
    const blogQuery = query(collection(db, 'blogs'), orderBy('createdAt','desc'), limit(1));

    // Retrieve the latest blog post
    const blogSnapshot = await(getDocs(blogQuery));

    if (blogSnapshot.docs.length > 0) {
        // Get the first (latest) blog post
        const blog = blogSnapshot.docs[0].data();
        const blogId = blogSnapshot.docs[0].id;

        // Render the main page and pass the blog data to the template
        res.render('main', { blog, blogId, user: req.user });
    } else {
        // If no blogs are found, render null values
        res.render('main', { blog: null, blogId: null, user: req.user});
    }
});

// Controller to render the next (earlier) blog post
const renderNextBlog = asyncHandler(async (req, res) => {
    // Get the last blog post ID from the request params
    const { lastBlogId } = req.params;

    // Get the reference to the last blog post using its ID
    const lastBlogRef = doc(db, 'blogs', lastBlogId);
    const lastBlogSnapshot = await getDoc(lastBlogRef);

    // Check if the last blog exists
    if (!lastBlogSnapshot.exists()) {
        return res.redirect('/main'); // Redirect if the blog post doesn't exist
    }

    // Query to get the next blog post (earlier post)
    const blogQuery = query(
        collection(db, 'blogs'),
        orderBy('createdAt', 'desc'),
        startAfter(lastBlogSnapshot), // Start after the last blog's snapshot
        limit(1)
    );

    // Retrive the next blog post
    const blogSnapshot = await getDocs(blogQuery);

    if (blogSnapshot.docs.length > 0) {
        // Get the next blog post and its ID
        const blog = blogSnapshot.docs[0].data();
        const blogId = blogSnapshot.docs[0].id;

        // Render the main page with the next blog post
        res.render('main', { blog, blogId, user: req.user }); 
    } else {
        res.redirect('/main'); // Redirect if no more blogs are available
    }
});

// Export the main page controller for use in the main route
module.exports = { renderLatestBlog, renderNextBlog };