// Main page functionality for StreamVibe
class MainPageManager {
    constructor() {
        this.authSection = document.getElementById('authSection');
        this.loginButton = document.getElementById('loginButton');
        this.userProfile = document.getElementById('userProfile');
        this.userAvatar = document.getElementById('userAvatar');
        this.userName = document.getElementById('userName');
        this.userDropdown = document.getElementById('userDropdown');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        this.initializeEventListeners();
        this.updateAuthUI();
    }

    initializeEventListeners() {
        // Logout button click
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // User profile click to toggle dropdown
        if (this.userProfile) {
            this.userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserDropdown();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.closeUserDropdown();
        });

        // Prevent dropdown from closing when clicking inside it
        if (this.userDropdown) {
            this.userDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    // Update UI based on authentication state
    updateAuthUI() {
        const isAuthenticated = authStorage.isAuthenticated();
        
        if (isAuthenticated) {
            this.showUserProfile();
        } else {
            this.showLoginButton();
        }
    }

    // Show login button
    showLoginButton() {
        if (this.loginButton) {
            this.loginButton.style.display = 'block';
        }
        if (this.userProfile) {
            this.userProfile.style.display = 'none';
        }
    }

    // Show user profile
    showUserProfile() {
        const userData = authStorage.getUserData();
        
        if (userData) {
            // Update user information
            if (this.userName) {
                this.userName.textContent = userData.name || 'User';
            }
            
            if (this.userAvatar) {
                this.userAvatar.src = userData.avatar || 'assets/icon-btn.png';
                this.userAvatar.alt = userData.name || 'User Avatar';
            }
        }
        
        if (this.loginButton) {
            this.loginButton.style.display = 'none';
        }
        if (this.userProfile) {
            this.userProfile.style.display = 'flex';
        }
    }

    // Toggle user dropdown
    toggleUserDropdown() {
        if (this.userDropdown) {
            const isVisible = this.userDropdown.style.display === 'block';
            this.userDropdown.style.display = isVisible ? 'none' : 'block';
        }
    }

    // Close user dropdown
    closeUserDropdown() {
        if (this.userDropdown) {
            this.userDropdown.style.display = 'none';
        }
    }

    // Handle logout
    handleLogout() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to logout?')) {
            authStorage.clearAuth();
            
            // Show logout message
            this.showMessage('Logged out successfully!', 'success');
            
            // Update UI
            this.updateAuthUI();
            
            // Redirect to login page after delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }

    // Show message (similar to auth.js)
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.main-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `main-message main-message-${type}`;
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

    // Check if user should be redirected to login
    checkAuthRequired() {
        // For now, we'll allow access to the main page without authentication
        // In a real app, you might want to redirect to login for certain content
        return true;
    }
}

// Content protection manager
class ContentProtectionManager {
    constructor() {
        this.protectedElements = document.querySelectorAll('.protected-content');
        this.initializeProtection();
    }

    initializeProtection() {
        const isAuthenticated = authStorage.isAuthenticated();
        
        this.protectedElements.forEach(element => {
            if (!isAuthenticated) {
                this.addProtectionOverlay(element);
            }
        });
    }

    addProtectionOverlay(element) {
        const overlay = document.createElement('div');
        overlay.className = 'content-protection-overlay';
        overlay.innerHTML = `
            <div class="protection-message">
                <h3>Login Required</h3>
                <p>Please login to access this content</p>
                <a href="login.html" class="protection-login-btn">Login Now</a>
            </div>
        `;
        
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            border-radius: 12px;
        `;
        
        element.style.position = 'relative';
        element.appendChild(overlay);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main page manager
    new MainPageManager();
    
    // Initialize content protection (optional)
    // new ContentProtectionManager();
    
    // Add welcome message for authenticated users
    if (authStorage.isAuthenticated()) {
        const userData = authStorage.getUserData();
        if (userData) {
            console.log(`Welcome back, ${userData.name}!`);
        }
    }
});

// Add CSS for slideIn animation if not already added
if (!document.querySelector('#mainPageStyles')) {
    const style = document.createElement('style');
    style.id = 'mainPageStyles';
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
        
        .protection-message {
            text-align: center;
            color: white;
        }
        
        .protection-message h3 {
            margin-bottom: 10px;
            font-size: 24px;
        }
        
        .protection-message p {
            margin-bottom: 20px;
            color: #ccc;
        }
        
        .protection-login-btn {
            background: #E50000;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.3s ease;
        }
        
        .protection-login-btn:hover {
            background: #cc0000;
        }
    `;
    document.head.appendChild(style);
}
