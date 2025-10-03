// Dashboard functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    checkAuth();
    
    // Update user welcome message
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userWelcome').textContent = `Welcome, ${user.username}`;
    }

    // Load dashboard data
    await loadDashboardData();
    
    // Initialize charts
    initializeCharts();
});

async function loadDashboardData() {
    try {
        showLoading();
        
        // Simulate API calls (replace with actual API endpoints)
        const stats = await simulateAPICall('/dashboard/stats/');
        const activities = await simulateAPICall('/dashboard/activities/');
        
        // Update stats
        document.getElementById('totalEmployees').textContent = stats.total_employees;
        document.getElementById('presentToday').textContent = stats.present_today;
        document.getElementById('lateToday').textContent = stats.late_today;
        document.getElementById('pendingLeaves').textContent = stats.pending_leaves;
        
        // Update recent activities
        updateRecentActivities(activities);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Failed to load dashboard data', 'error');
    } finally {
        hideLoading();
    }
}

function initializeCharts() {
    // Attendance Chart
    const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
    new Chart(attendanceCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Present',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: '#10B981',
            }, {
                label: 'Absent',
                data: [28, 48, 40, 19, 86, 27, 90],
                backgroundColor: '#EF4444',
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Department Chart
    const departmentCtx = document.getElementById('departmentChart').getContext('2d');
    new Chart(departmentCtx, {
        type: 'doughnut',
        data: {
            labels: ['IT', 'HR', 'Finance', 'Marketing', 'Operations'],
            datasets: [{
                data: [30, 20, 15, 20, 15],
                backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#8B5CF6'
                ],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

function updateRecentActivities(activities) {
    const container = document.getElementById('recentActivity');
    container.innerHTML = '';

    activities.forEach(activity => {
        const activityEl = document.createElement('div');
        activityEl.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        activityEl.innerHTML = `
            <div class="flex items-center">
                <div class="w-2 h-2 ${getActivityColor(activity.type)} rounded-full mr-3"></div>
                <span>${activity.message}</span>
            </div>
            <span class="text-sm text-gray-500">${activity.time}</span>
        `;
        container.appendChild(activityEl);
    });
}

function getActivityColor(type) {
    const colors = {
        'check_in': 'bg-green-500',
        'check_out': 'bg-blue-500',
        'leave_applied': 'bg-yellow-500',
        'leave_approved': 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-500';
}

// Simulate API calls (replace with actual API calls)
function simulateAPICall(endpoint) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockData = {
                '/dashboard/stats/': {
                    total_employees: 47,
                    present_today: 42,
                    late_today: 3,
                    pending_leaves: 5
                },
                '/dashboard/activities/': [
                    { type: 'check_in', message: 'John Doe checked in', time: '2 hours ago' },
                    { type: 'check_out', message: 'Jane Smith checked out', time: '1 hour ago' },
                    { type: 'leave_applied', message: 'Mike Johnson applied for leave', time: '30 minutes ago' }
                ]
            };
            resolve(mockData[endpoint]);
        }, 1000);
    });
}