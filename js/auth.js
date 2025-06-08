// Authentication functionality
class AuthManager {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.loginBtn = document.querySelector('.login-btn');
        
        this.initializeEventListeners();
        this.checkAuthState();
    }

    initializeEventListeners() {
        // Form submission
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Password visibility toggle
        if (this.passwordToggle) {
            this.passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Real-time validation
        if (this.emailInput) {
            this.emailInput.addEventListener('blur', () => this.validateEmail());
            this.emailInput.addEventListener('input', () => this.clearError('emailError'));
        }

        if (this.passwordInput) {
            this.passwordInput.addEventListener('blur', () => this.validatePassword());
            this.passwordInput.addEventListener('input', () => this.clearError('passwordError'));
        }
    }

    // Handle login form submission
    async handleLogin(event) {
        event.preventDefault();
        
        // Validate form
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;

        // Show loading state
        this.setLoadingState(true);

        try {
            // Authenticate user
            const userData = await userDatabase.authenticate(email, password);
            
            // Save authentication state
            authStorage.setAuthState(true, userData);
            
            // Show success message
            this.showMessage('Login successful! Redirecting...', 'success');
            
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
        
        this.clearError('passwordError');
        return true;
    }

    // Toggle password visibility
    togglePasswordVisibility() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        
        const icon = this.passwordToggle.querySelector('.toggle-icon');
        icon.textContent = type === 'password' ? '👁️' : '🙈';
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
        if (this.loginBtn) {
            if (isLoading) {
                this.loginBtn.classList.add('loading');
                this.loginBtn.disabled = true;
                this.loginBtn.textContent = 'Logging in...';
            } else {
                this.loginBtn.classList.remove('loading');
                this.loginBtn.disabled = false;
                this.loginBtn.textContent = 'Log In';
            }
        }
    }

    // Check authentication state on page load
    checkAuthState() {
        if (authStorage.isAuthenticated()) {
            // If on login page and already authenticated, redirect to main page
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'index.html';
            }
        }
    }

    // Logout function
    static logout() {
        authStorage.clearAuth();
        window.location.href = 'login.html';
    }
}

// Initialize authentication manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
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
