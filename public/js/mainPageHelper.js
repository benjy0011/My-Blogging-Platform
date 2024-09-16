// Function to convert Firestore Timestamp to formatted date string
function formatTimestamp(timestamp) {
    // Convert the Firestore Timestamp to a JavaScript Date object
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    // Define options for date formatting
    const options = { day: '2-digit', month: 'short', year: 'numeric' };

    // Format the date using toLocaleDateString
    return date.toLocaleDateString('en-GB', options); // 'en-GB' locale gives 'dd-mmm-yyyy' format
}

// Function to update the created date on the blog post
function updateBlogPostDate() {
    // Get all elements with the id 'createdOn'
    const createdOnElements = document.querySelectorAll('[data-timestamp]');

    createdOnElements.forEach(element => {
        // Get timestamp from the data attribute
        const timestamp = JSON.parse(element.getAttribute('data-timestamp'));

        // Format the timestamp
        const formattedDate = formatTimestamp(timestamp);

        // Update the element's text content
        element.textContent = formattedDate;
    });
}

// Attach the function to DOMContentLoaded event
document.addEventListener('DOMContentLoaded', updateBlogPostDate);

// Function to toggle like/unlike blog posts
async function toggleLike(blogId, button) {
    // Whether the button is currently Liked or NoLiked
    const isLiked = button.getAttribute('data-liked') === 'true';

    try {
        // Send a POST request to the server to toggle the like state
        const response = await fetch(`/like-blog/${blogId}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
        });
        
        // Parse the JSON response from the server
        const data = await response.json();

        // If the server indicates success, update the UI
        if (data.success) {
            // Update the button and like count based on whether the blog is liked or no
            button.setAttribute('data-like', data.isLiked);
            const icon = button.querySelector('i');
            icon.classList.toggle('ri-heart-fill', data.isLiked);
            icon.classList.toggle('ri-heart-line', !data.isLiked);

            // Update the like count dynamically
            button.querySelector('.like-count').textContent = data.isLiked
                ? +button.querySelector('.like-count').textContent + 1
                : +button.querySelector('.like-count').textContent - 1;
        } else {
            alert("Error toggling like");
        }
    } catch (error) {
        console.error('error toggling like:', error)
    }
}

// Function to handle comment form submission
async function submitComment(blogId, form) {
    // Create a FormData object to  easilt retrieve the form data
    const formData = new FormData(form);
    const comment = formData.get('comment'); // Get the comment text from the form data

    try {
        // Send a POST request to the server to add the comment
        const response = await fetch(`/comment-blog/${blogId}`, {
            method: 'POST',
            body: JSON.stringify({ comment }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Parse the JSON response from the server
        const data = await response.json();

        // If the server indicates success, update the UI
        if (data.success) {
            // Locate the comments section and append the new comment to the list
            const commentSection = form.closest('.comments-section');
            const commentList = commentSection.querySelector('ul');
            const newCommentItem = document.createElement('li');
            newCommentItem.innerHTML = `<strong>${data.userName}:</strong> ${comment}`;
            commentList.appendChild(newCommentItem);

            // Clear the comment input field
            form.reset();
        } else {
            alert("Error submitting comment");
        }
    } catch (error) {
        // Log any errors to the console
        console.error('Error submitting comment:', error)
    }
}

// Attach event listeners to elements when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add click event listeners to all like buttons
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Retrieve the blog ID from the button's data attribute
            const blogId = button.getAttribute('data-blog-id');
            // Call the function to toggle the like state
            toggleLike(blogId, button);
        });
    });

    // Add submit event listeners to all comment forms 
    document.querySelectorAll('.comments-section form').forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission behaviour
            // Retrieve the blog ID from the form's data attribute
            const blogId = form.getAttribute('data-blog-id');
            // Call the function to submit the comment
            submitComment(blogId, form);
        });
    });
});