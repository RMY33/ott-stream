// Signup functionality
class SignupManager {
    constructor() {
        this.signupForm = document.getElementById('signupForm');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
        this.signupBtn = document.querySelector('.login-btn');
        
        this.initializeEventListeners();
        this.checkAuthState();
    }

    initializeEventListeners() {
        // Form submission
        if (this.signupForm) {
            this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Password visibility toggles
        if (this.passwordToggle) {
            this.passwordToggle.addEventListener('click', () => this.togglePasswordVisibility('password'));
        }
        
        if (this.confirmPasswordToggle) {
            this.confirmPasswordToggle.addEventListener('click', () => this.togglePasswordVisibility('confirmPassword'));
        }

        // Real-time validation
        if (this.nameInput) {
            this.nameInput.addEventListener('blur', () => this.validateName());
            this.nameInput.addEventListener('input', () => this.clearError('nameError'));
        }

        if (this.emailInput) {
            this.emailInput.addEventListener('blur', () => this.validateEmail());
            this.emailInput.addEventListener('input', () => this.clearError('emailError'));
        }

        if (this.passwordInput) {
            this.passwordInput.addEventListener('blur', () => this.validatePassword());
            this.passwordInput.addEventListener('input', () => this.clearError('passwordError'));
        }

        if (this.confirmPasswordInput) {
            this.confirmPasswordInput.addEventListener('blur', () => this.validateConfirmPassword());
            this.confirmPasswordInput.addEventListener('input', () => this.clearError('confirmPasswordError'));
        }
    }

    // Handle signup form submission
    async handleSignup(event) {
        event.preventDefault();
        
        // Validate form
        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        const isConfirmPasswordValid = this.validateConfirmPassword();
        
        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            return;
        }

        const userData = {
            name: this.nameInput.value.trim(),
            email: this.emailInput.value.trim(),
            password: this.passwordInput.value
        };

        // Show loading state
        this.setLoadingState(true);

        try {
            // Register user
            const newUser = await userDatabase.register(userData);
            
            // Save authentication state
            authStorage.setAuthState(true, newUser);
            
            // Show success message
            this.showMessage('Account created successfully! Redirecting...', 'success');
            
            // Redirect to main page after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            this.showMessage(error.message, 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    // Validate name
    validateName() {
        const name = this.nameInput.value.trim();
        
        if (!name) {
            this.showError('nameError', 'Full name is required');
            return false;
        }
        
        if (name.length < 2) {
            this.showError('nameError', 'Name must be at least 2 characters');
            return false;
        }
        
        this.clearError('nameError');
        return true;
    }

    // Validate email
    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError('emailError', 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError('emailError', 'Please enter a valid email address');
            return false;
        }
        
        this.clearError('emailError');
        return true;
    }

    // Validate password
    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('passwordError', 'Password is required');
            return false;
        }
        
        if (password.length < 6) {
            this.showError('passwordError', 'Password must be at least 6 characters');
            return false;
        }
        
        // Check for at least one number and one letter
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        
        if (!hasNumber || !hasLetter) {
            this.showError('passwordError', 'Password must contain at least one letter and one number');
            return false;
        }
        
        this.clearError('passwordError');
        return true;
    }

    // Validate confirm password
    validateConfirmPassword() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        
        if (!confirmPassword) {
            this.showError('confirmPasswordError', 'Please confirm your password');
            return false;
        }
        
        if (password !== confirmPassword) {
            this.showError('confirmPasswordError', 'Passwords do not match');
            return false;
        }
        
        this.clearError('confirmPasswordError');
        return true;
    }

    // Toggle password visibility
    togglePasswordVisibility(fieldName) {
        const input = document.getElementById(fieldName);
        const toggle = document.getElementById(fieldName + 'Toggle');
        
        if (input && toggle) {
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            
            const icon = toggle.querySelector('.toggle-icon');
            icon.textContent = type === 'password' ? '👁️' : '🙈';
        }
    }

    // Show error message
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // Clear error message
    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // Show general message
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message auth-message-${type}`;
        messageDiv.textContent = message;
        
        // Add styles
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            ${type === 'success' ? 'background: #00ff88;' : ''}
            ${type === 'error' ? 'background: #ff4757;' : ''}
            ${type === 'info' ? 'background: #3742fa;' : ''}
        `;

        document.body.appendChild(messageDiv);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }

    // Set loading state
    setLoadingState(isLoading) {
        if (this.signupBtn) {
            if (isLoading) {
                this.signupBtn.classList.add('loading');
                this.signupBtn.disabled = true;
                this.signupBtn.textContent = 'Creating Account...';
            } else {
                this.signupBtn.classList.remove('loading');
                this.signupBtn.disabled = false;
                this.signupBtn.textContent = 'Sign Up';
            }
        }
    }

    // Check authentication state on page load
    checkAuthState() {
        if (authStorage.isAuthenticated()) {
            // If on signup page and already authenticated, redirect to main page
            window.location.href = 'index.html';
        }
    }
}

// Initialize signup manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignupManager();
});

// Add CSS animation for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
