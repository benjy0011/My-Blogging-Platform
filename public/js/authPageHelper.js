function toggleForms() {
    var formSlider = document.getElementById('form-slider'); // Get the form-slider div from html
    // Toggling between slide-left and slide-right
    if (formSlider.classList.contains('slide-left')) { // Check if currently in slide-left (initial state)
        formSlider.classList.remove('slide-left');
        formSlider.classList.add('slide-right');
    } else {
        formSlider.classList.remove('slide-right');
        formSlider.classList.add('slide-left'); 
    }
}

function togglePassword(fieldId, icon) {
    var passwordField = document.getElementById(fieldId);
    if (passwordField.type === "password") { // Check if currrently is password (hidden text)
        passwordField.type = "text";
        icon.classList.remove('ri-eye-off-line');
        icon.classList.add('ri-eye-line');
    } else {
        passwordField.type = "password";
        icon.classList.remove('ri-eye-line');
        icon.classList.add('ri-eye-off-line');
    }
}

function validateSignUpForm() {
    var password = document.getElementById('signup-password').value;
    var confirmPassword = document.getElementById('signup-confirm-password').value;
    var terms = document.getElementById('terms');

    // Password regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\w]).{8,}$/;

    if (!passwordRegex.test(password)) { // todo: lowercase, uppercase , symbol and number (regex)
        alert('Password must be at least 8 characters long, with at least one uppercase, one lowercase, one number and one symbols');
        return false;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }

    if(!terms.checked) {
        alert("You must agree to the terms and conditions");
        return false;
    }
    return true;
}

// hide the error message after 3 seconds
const errorMessage = document.getElementById('login-error-message');
if (errorMessage) {
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000); // 3000ms
}
