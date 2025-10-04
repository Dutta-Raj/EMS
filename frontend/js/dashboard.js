// Dashboard functionality
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Dashboard loaded');
    
    // Load dashboard data
    const data = await window.API.fetchDashboardData();
    
    if (data) {
        // Update stats
        document.getElementById('totalEmployees').textContent = data.total_employees || 0;
        document.getElementById('presentToday').textContent = data.present_today || 0;
        document.getElementById('lateToday').textContent = data.late_today || 0;
        document.getElementById('pendingLeaves').textContent = data.pending_leaves || 0;
    }
    
    // Initialize charts (basic example)
    initializeCharts();
});

function initializeCharts() {
    console.log('Initializing charts...');
    // Chart initialization will go here
}