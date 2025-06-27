// Login System JavaScript
class LoginSystem {
    constructor() {
        this.accounts = this.loadAccounts();
        this.currentUser = this.getCurrentUser();
        this.accessLog = this.loadAccessLog();
        this.init();
    }

    init() {
        // Check if user is already logged in
        if (this.currentUser) {
            this.redirectToPortfolio();
            return;
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Password toggle
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Create account modal
        const createAccountBtn = document.getElementById('createAccountBtn');
        const closeModal = document.getElementById('closeModal');
        const modal = document.getElementById('createAccountModal');

        if (createAccountBtn) {
            createAccountBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'flex';
            });
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }

        // Create account form
        const createAccountForm = document.getElementById('createAccountForm');
        if (createAccountForm) {
            createAccountForm.addEventListener('submit', (e) => this.handleCreateAccount(e));
        }

        // Access log viewer
        const viewAccessLogBtn = document.getElementById('viewAccessLogBtn');
        const accessLogModal = document.getElementById('accessLogModal');
        const closeLogModal = document.getElementById('closeLogModal');

        if (viewAccessLogBtn) {
            viewAccessLogBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.displayAccessLog();
                accessLogModal.style.display = 'flex';
            });
        }

        if (closeLogModal) {
            closeLogModal.addEventListener('click', () => {
                accessLogModal.style.display = 'none';
            });
        }

        // Close access log modal when clicking outside
        if (accessLogModal) {
            accessLogModal.addEventListener('click', (e) => {
                if (e.target === accessLogModal) {
                    accessLogModal.style.display = 'none';
                }
            });
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const errorMessage = document.getElementById('errorMessage');
        const loginBtn = e.target.querySelector('.login-btn');

        // Add loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        // Simulate loading delay
        setTimeout(() => {
            if (this.validateLogin(username, password)) {
                // Log successful access
                this.logAccess(username, 'SUCCESS', 'Login successful');
                
                // Save session
                const sessionData = {
                    username: username,
                    loginTime: new Date().toISOString(),
                    rememberMe: rememberMe
                };

                if (rememberMe) {
                    localStorage.setItem('portfolioSession', JSON.stringify(sessionData));
                } else {
                    sessionStorage.setItem('portfolioSession', JSON.stringify(sessionData));
                }

                // Redirect to portfolio
                this.redirectToPortfolio();
            } else {
                // Log failed access attempt
                this.logAccess(username, 'FAILED', 'Invalid credentials');
                
                // Show error
                errorMessage.style.display = 'flex';
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 5000);
            }

            // Remove loading state
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }, 1000);
    }

    validateLogin(username, password) {
        // Check default admin account (stationary credentials)
        if (username === 'DanielGarcia' && password === 'Daniel0804') {
            return true;
        }

        // Check created accounts only
        const accounts = this.loadAccounts();
        return accounts.some(account => 
            account.username === username && account.password === password
        );
    }

    handleCreateAccount(e) {
        e.preventDefault();
        
        const newUsername = document.getElementById('newUsername').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('email').value.trim();
        const createBtn = e.target.querySelector('.create-btn');

        // Validation
        if (!this.validateCreateAccount(newUsername, newPassword, confirmPassword, email)) {
            return;
        }

        // Add loading state
        createBtn.classList.add('loading');
        createBtn.disabled = true;

        setTimeout(() => {
            // Create new account
            const newAccount = {
                username: newUsername,
                password: newPassword,
                email: email,
                createdAt: new Date().toISOString()
            };

            const accounts = this.loadAccounts();
            accounts.push(newAccount);
            this.saveAccounts(accounts);
            
            // Log account creation
            this.logAccess(newUsername, 'ACCOUNT_CREATED', 'New account registered');

            // Show success message
            this.showSuccessMessage('Account created successfully! You can now login.');
            
            // Close modal and reset form
            document.getElementById('createAccountModal').style.display = 'none';
            e.target.reset();

            // Remove loading state
            createBtn.classList.remove('loading');
            createBtn.disabled = false;
        }, 1500);
    }

    validateCreateAccount(username, password, confirmPassword, email) {
        // Check if username already exists
        const accounts = this.loadAccounts();
        if (accounts.some(account => account.username === username) || username === 'DanielGarcia') {
            this.showError('Username already exists. Please choose a different one.');
            return false;
        }

        // Check password match
        if (password !== confirmPassword) {
            this.showError('Passwords do not match.');
            return false;
        }

        // Check password strength
        if (password.length < 6) {
            this.showError('Password must be at least 6 characters long.');
            return false;
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('Please enter a valid email address.');
            return false;
        }

        return true;
    }

    showError(message) {
        // Remove existing error messages
        const existingError = document.querySelector('.modal-content .error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
        
        const form = document.getElementById('createAccountForm');
        form.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    showSuccessMessage(message) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i>${message}`;
        
        const loginForm = document.getElementById('loginForm');
        loginForm.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    togglePasswordVisibility() {
        const passwordField = document.getElementById('password');
        const toggleIcon = document.getElementById('togglePassword');
        
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordField.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    loadAccounts() {
        const savedAccounts = localStorage.getItem('portfolioAccounts');
        return savedAccounts ? JSON.parse(savedAccounts) : [];
    }

    saveAccounts(accounts) {
        localStorage.setItem('portfolioAccounts', JSON.stringify(accounts));
    }

    loadAccessLog() {
        const savedLog = localStorage.getItem('portfolioAccessLog');
        return savedLog ? JSON.parse(savedLog) : [];
    }

    saveAccessLog(log) {
        localStorage.setItem('portfolioAccessLog', JSON.stringify(log));
    }

    logAccess(username, status, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            username: username,
            status: status, // SUCCESS, FAILED, ACCOUNT_CREATED, LOGOUT
            details: details,
            ipAddress: 'Local', // Since this is client-side
            userAgent: navigator.userAgent
        };

        const accessLog = this.loadAccessLog();
        accessLog.push(logEntry);
        
        // Keep only last 100 entries to prevent storage overflow
        if (accessLog.length > 100) {
            accessLog.splice(0, accessLog.length - 100);
        }
        
        this.saveAccessLog(accessLog);
        console.log('Access Log Entry:', logEntry);
    }

    getCurrentUser() {
        // Check both localStorage and sessionStorage
        const localSession = localStorage.getItem('portfolioSession');
        const sessionSession = sessionStorage.getItem('portfolioSession');
        
        const session = localSession || sessionSession;
        return session ? JSON.parse(session) : null;
    }

    displayAccessLog() {
        const accessLog = this.loadAccessLog();
        const logEntries = document.getElementById('logEntries');
        const totalEntries = document.getElementById('totalEntries');
        const successfulLogins = document.getElementById('successfulLogins');
        const failedAttempts = document.getElementById('failedAttempts');

        // Calculate statistics
        const successCount = accessLog.filter(entry => entry.status === 'SUCCESS').length;
        const failedCount = accessLog.filter(entry => entry.status === 'FAILED').length;

        // Update statistics
        totalEntries.textContent = accessLog.length;
        successfulLogins.textContent = successCount;
        failedAttempts.textContent = failedCount;

        // Clear existing entries
        logEntries.innerHTML = '';

        if (accessLog.length === 0) {
            logEntries.innerHTML = `
                <div class="no-logs">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No access logs found</p>
                </div>
            `;
            return;
        }

        // Sort logs by timestamp (newest first)
        const sortedLogs = accessLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Display logs
        sortedLogs.forEach(entry => {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${entry.status.toLowerCase().replace('_', '-')}`;
            
            const timestamp = new Date(entry.timestamp).toLocaleString();
            const statusClass = entry.status.toLowerCase().replace('_', '-');
            
            logEntry.innerHTML = `
                <div class="log-header">
                    <span class="log-username">${entry.username}</span>
                    <span class="log-timestamp">${timestamp}</span>
                </div>
                <div class="log-status ${statusClass}">${entry.status.replace('_', ' ')}</div>
                <div class="log-details">${entry.details}</div>
            `;
            
            logEntries.appendChild(logEntry);
        });
    }

    redirectToPortfolio() {
        window.location.href = 'index.html';
    }

    // Static method to check if user is logged in (for portfolio page)
    static isLoggedIn() {
        const localSession = localStorage.getItem('portfolioSession');
        const sessionSession = sessionStorage.getItem('portfolioSession');
        return !!(localSession || sessionSession);
    }

    // Static method to logout
    static logout() {
        // Log logout action
        const currentUser = LoginSystem.getCurrentUser();
        if (currentUser) {
            const loginSystem = new LoginSystem();
            loginSystem.logAccess(currentUser.username, 'LOGOUT', 'User logged out');
        }
        
        localStorage.removeItem('portfolioSession');
        sessionStorage.removeItem('portfolioSession');
        window.location.href = 'login.html';
    }

    // Static method to get current user info
    static getCurrentUser() {
        const localSession = localStorage.getItem('portfolioSession');
        const sessionSession = sessionStorage.getItem('portfolioSession');
        
        const session = localSession || sessionSession;
        return session ? JSON.parse(session) : null;
    }
}

// Initialize login system when page loads
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});

// Export for use in other files
window.LoginSystem = LoginSystem;