// Authentication management
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on login page
    if (window.location.pathname.includes('login.html')) {
        const loginForm = document.getElementById('loginForm');
        const errorDiv = document.getElementById('error-message');

        if (loginForm) {
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                try {
                    showLoading();
                    const response = await APIService.login(username, password);
                    
                    // Store token and user data
                    localStorage.setItem('authToken', response.access);
                    localStorage.setItem('userData', JSON.stringify(response.user));
                    
                    showNotification('Login successful!', 'success');
                    
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                    
                } catch (error) {
                    errorDiv.textContent = error.message || 'Login failed. Please check your credentials.';
                    errorDiv.classList.remove('hidden');
                    showNotification('Login failed!', 'error');
                } finally {
                    hideLoading();
                }
            });
        }
    }

    // Check authentication on protected pages
    if (!window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('index.html')) {
        checkAuth();
    }

    // Add logout functionality to all pages
    const logoutButtons = document.querySelectorAll('[data-logout]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            APIService.logout();
        });
    });
});

// Get current user data
function getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Check user role
function hasRole(role) {
    const user = getCurrentUser();
    return user && user.role === role;
}

// Redirect based on role
function redirectBasedOnRole() {
    const user = getCurrentUser();
    if (user) {
        switch(user.role) {
            case 'admin':
                window.location.href = 'dashboard.html';
                break;
            case 'hr':
                window.location.href = 'employees.html';
                break;
            case 'employee':
                window.location.href = 'attendance.html';
                break;
            default:
                window.location.href = 'dashboard.html';
        }
    }
}