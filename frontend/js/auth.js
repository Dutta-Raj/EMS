// Authentication functions
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.querySelector('[data-logout]');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                alert('Logout functionality will be implemented soon!');
                // Redirect to login page or handle logout
                // window.location.href = '/login/';
            }
        });
    }
    
    // Update welcome message
    const welcomeElement = document.getElementById('userWelcome');
    if (welcomeElement) {
        welcomeElement.textContent = 'Welcome, Admin';
    }
});