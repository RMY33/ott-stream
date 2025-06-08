// Local Storage Management for User Authentication
class AuthStorage {
    constructor() {
        this.storageKey = 'streamvibe_auth';
        this.userKey = 'streamvibe_user';
    }

    // Save authentication state
    setAuthState(isAuthenticated, userData = null) {
        localStorage.setItem(this.storageKey, JSON.stringify({
            isAuthenticated,
            timestamp: Date.now()
        }));
        
        if (userData) {
            localStorage.setItem(this.userKey, JSON.stringify(userData));
        }
    }

    // Get authentication state
    getAuthState() {
        try {
            const authData = localStorage.getItem(this.storageKey);
            if (!authData) return { isAuthenticated: false };
            
            const parsed = JSON.parse(authData);
            
            // Check if session is expired (24 hours)
            const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            const isExpired = Date.now() - parsed.timestamp > sessionDuration;
            
            if (isExpired) {
                this.clearAuth();
                return { isAuthenticated: false };
            }
            
            return parsed;
        } catch (error) {
            console.error('Error reading auth state:', error);
            return { isAuthenticated: false };
        }
    }

    // Get user data
    getUserData() {
        try {
            const userData = localStorage.getItem(this.userKey);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error reading user data:', error);
            return null;
        }
    }

    // Clear authentication data
    clearAuth() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.userKey);
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.getAuthState().isAuthenticated;
    }
}

// Demo user database (in real app, this would be server-side)
class UserDatabase {
    constructor() {
        this.users = [
            {
                id: 1,
                email: 'demo@streamvibe.com',
                password: 'password123',
                name: 'Demo User',
                avatar: 'assets/icon-btn.png'
            },
            {
                id: 2,
                email: 'user@example.com',
                password: 'demo123',
                name: 'John Doe',
                avatar: 'assets/icon-btn.png'
            }
        ];
    }

    // Authenticate user (simulate server authentication)
    authenticate(email, password) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                const user = this.users.find(u => 
                    u.email.toLowerCase() === email.toLowerCase() && 
                    u.password === password
                );
                
                if (user) {
                    // Return user data without password
                    const { password: _, ...userData } = user;
                    resolve(userData);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000); // 1 second delay to simulate network request
        });
    }

    // Register new user (for future implementation)
    register(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if email already exists
                const existingUser = this.users.find(u => 
                    u.email.toLowerCase() === userData.email.toLowerCase()
                );
                
                if (existingUser) {
                    reject(new Error('Email already exists'));
                } else {
                    const newUser = {
                        id: this.users.length + 1,
                        ...userData,
                        avatar: 'assets/icon-btn.png'
                    };
                    this.users.push(newUser);
                    
                    // Return user data without password
                    const { password: _, ...userDataResponse } = newUser;
                    resolve(userDataResponse);
                }
            }, 1000);
        });
    }
}

// Initialize storage and database
const authStorage = new AuthStorage();
const userDatabase = new UserDatabase();
