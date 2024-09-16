// Import Firebase services for database and storage
const { collection, addDoc, updateDoc, getDoc, doc, arrayRemove, arrayUnion } = require("firebase/firestore");
const { db, storage } = require("../config/firebase");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const asyncHandler = require("express-async-handler");

// Controller to create a new blog post
const createBlog = asyncHandler(async (req, res) => {
    const { title, content} = req.body;
    let mediaUrl = ''; // Initialize media URL as an empty string

    // Get the email of the logged in user
    const userEmail = req.user.email; 
    const userName = req.user.name;
    
    // If a file is uploaded, store it in Firebase Storarge and get the download URL
    if (req.file) {
        const storageRef = ref(storage, `blogs/${req.file.originalname}`);
        const uploadResult = await uploadBytes(storageRef, req.file.buffer);
        mediaUrl = await getDownloadURL(uploadResult.ref); // Get the downloadable URL
    };

    // Add the new blog post to Firestore database
    await addDoc(collection(db, 'blogs'), {
        title,
        content,
        mediaUrl,
        email: userEmail,
        posterName: userName,
        likes: [], // Empty array for likes (to be filled later)
        comments: [], // Empty array too
        createdAt: new Date(), // Store the creation timestamp
    });

    // Redirect to the main page after successful creation of the blog post
    res.redirect('/main');
});

// Controller to increment the like count on the blog post
const toggleLikeBlog = asyncHandler(async (req, res) => {
    const blogId = req.params.id; // Get the blog post ID from the URL parameter
    const blogRef = doc(db, 'blogs', blogId); // Reference to the specific blog document

    // Get the blog document from Firestore
    const blogDoc = await getDoc(blogRef);

    // Get the user ID from the decoded JWT token
    const userId = req.user.uid; 

    // If the document exists, update the like count
    if (blogDoc.exists()) {
        const blogData = blogDoc.data();

        // To store likes array
        let updatedLikes;
        let isLiked;
        // Check if the user has already liked the blog
        if (blogData.likes.includes(userId)) {
            // If the user has liked it, unlike by remove the user ID from the likes array
            updatedLikes = arrayRemove(userId);
            isLiked = false;
        } else {
            // If the user hasn't liked it, like the blog by adding the user ID to the likes array
            updatedLikes = arrayUnion(userId);
            isLiked = true;
        }

        // Update the likes array in Firestore
        await updateDoc(blogRef, { likes: updatedLikes });

        // Send a success response with the updated like state
        res.json({ success: true, isLiked });
    } else {
        // Blog post not found
        res.status(404).json({ success: false });
    }
});

// Controller to add a comment to a blog post
const addCommentToBlog = asyncHandler(async (req, res) => {
    const blogId = req.params.id; // Get the blog ID from URL
    const blogRef = doc(db, 'blogs', blogId);
    const { comment } = req.body;
    const userId = req.user.uid; // Get the user ID form the decoded JWT token
    const userEmail = req.user.email; // Get the user's email
    const userName = req.user.name; // Get the user's displayName

    // Check if the blog post exists
    const blogSnapshot = await getDoc(blogRef);
    if (!blogSnapshot.exists()) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
    };

    // Prepare the new comment with the user ID, email, and comment text
    const newComment = {
        userId,
        userName,
        userEmail,
        comment,
        createdAt: new Date(),
    };

    // Update the blog document with the new comment
    await updateDoc(blogRef, {
        comments: arrayUnion(newComment)
    });

    // Send a success response with the commenter's email
    res.json({ success: true, userName });
});

module.exports = { createBlog, toggleLikeBlog, addCommentToBlog };