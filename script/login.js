const VALID_CREDENTIALS = {
    username: 'admin',
    password: 'admin123',
};

const signInBtn     = document.getElementById('signInBtn');
const usernameField = document.getElementById('usernameField');
const passwordField = document.getElementById('passwordField');

signInBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const enteredUsername = usernameField.value.trim();
    const enteredPassword = passwordField.value.trim();

    const isValid =
        enteredUsername === VALID_CREDENTIALS.username &&
        enteredPassword === VALID_CREDENTIALS.password;

    if (isValid) {
        window.location.href = './home.html';
    } else {
        alert('Invalid username or password. Please try again.');
    }
});
