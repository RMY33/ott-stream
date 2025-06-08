// Profile page functionality
class ProfileManager {
    constructor() {
        this.userProfile = document.getElementById('userProfile');
        this.userDropdown = document.getElementById('userDropdown');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.profileAvatar = document.getElementById('profileAvatar');
        this.profileName = document.getElementById('profileName');
        this.profileEmail = document.getElementById('profileEmail');
        this.memberSince = document.getElementById('memberSince');
        this.userAvatar = document.getElementById('userAvatar');
        this.userName = document.getElementById('userName');
        this.changeAvatarBtn = document.getElementById('changeAvatarBtn');
        this.editProfileBtn = document.getElementById('editProfileBtn');
        this.shareProfileBtn = document.getElementById('shareProfileBtn');
        
        this.initializeEventListeners();
        this.loadUserProfile();
        this.initializeTabs();
    }

    initializeEventListeners() {
        // Logout functionality
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // User profile dropdown
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

        // Change avatar button
        if (this.changeAvatarBtn) {
            this.changeAvatarBtn.addEventListener('click', () => {
                this.handleChangeAvatar();
            });
        }

        // Edit profile button
        if (this.editProfileBtn) {
            this.editProfileBtn.addEventListener('click', () => {
                this.handleEditProfile();
            });
        }

        // Share profile button
        if (this.shareProfileBtn) {
            this.shareProfileBtn.addEventListener('click', () => {
                this.handleShareProfile();
            });
        }
    }

    // Load user profile data
    loadUserProfile() {
        // Check if user is authenticated
        if (!authStorage.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        const userData = authStorage.getUserData();
        if (userData) {
            // Update profile information
            if (this.profileName) {
                this.profileName.textContent = userData.name || 'User';
            }
            
            if (this.profileEmail) {
                this.profileEmail.textContent = userData.email || 'user@example.com';
            }
            
            if (this.profileAvatar) {
                this.profileAvatar.src = userData.avatar || 'assets/icon-btn.png';
            }
            
            if (this.userAvatar) {
                this.userAvatar.src = userData.avatar || 'assets/icon-btn.png';
            }
            
            if (this.userName) {
                this.userName.textContent = userData.name || 'User';
            }
            
            // Set member since date (simulate based on user ID)
            if (this.memberSince) {
                const memberDate = this.getMemberSinceDate(userData.id);
                this.memberSince.textContent = memberDate;
            }
        }
    }

    // Get member since date based on user ID
    getMemberSinceDate(userId) {
        const dates = {
            1: 'January 2023',
            2: 'March 2023',
            3: 'June 2023'
        };
        return dates[userId] || 'January 2024';
    }

    // Initialize tabs functionality
    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button and corresponding pane
                button.classList.add('active');
                const targetPane = document.getElementById(targetTab);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
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
        if (confirm('Are you sure you want to logout?')) {
            authStorage.clearAuth();
            this.showMessage('Logged out successfully!', 'success');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }

    // Handle change avatar
    handleChangeAvatar() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newAvatarUrl = e.target.result;
                    
                    // Update avatar images
                    if (this.profileAvatar) {
                        this.profileAvatar.src = newAvatarUrl;
                    }
                    if (this.userAvatar) {
                        this.userAvatar.src = newAvatarUrl;
                    }
                    
                    // Update user data in storage
                    const userData = authStorage.getUserData();
                    if (userData) {
                        userData.avatar = newAvatarUrl;
                        authStorage.setAuthState(true, userData);
                    }
                    
                    this.showMessage('Avatar updated successfully!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
        
        fileInput.click();
    }

    // Handle edit profile
    handleEditProfile() {
        const userData = authStorage.getUserData();
        if (!userData) return;

        const newName = prompt('Enter new name:', userData.name);
        if (newName && newName.trim() !== '') {
            userData.name = newName.trim();
            authStorage.setAuthState(true, userData);
            
            // Update UI
            if (this.profileName) {
                this.profileName.textContent = userData.name;
            }
            if (this.userName) {
                this.userName.textContent = userData.name;
            }
            
            this.showMessage('Profile updated successfully!', 'success');
        }
    }

    // Handle share profile
    handleShareProfile() {
        const userData = authStorage.getUserData();
        if (!userData) return;

        const profileUrl = `${window.location.origin}/profile.html?user=${userData.id}`;
        
        if (navigator.share) {
            navigator.share({
                title: `${userData.name}'s StreamVibe Profile`,
                text: `Check out ${userData.name}'s profile on StreamVibe!`,
                url: profileUrl
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(profileUrl).then(() => {
                this.showMessage('Profile link copied to clipboard!', 'success');
            }).catch(() => {
                this.showMessage('Unable to copy link', 'error');
            });
        }
    }

    // Show message
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.profile-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `profile-message profile-message-${type}`;
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
}

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
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
