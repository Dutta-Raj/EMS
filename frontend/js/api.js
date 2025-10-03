// API configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

class APIService {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = localStorage.getItem('authToken');
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        // Add authorization header if token exists
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            
            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
            
            if (!response.ok) {
                throw new Error(
                    data.detail || 
                    data.message || 
                    data.error || 
                    `HTTP ${response.status}: ${response.statusText}`
                );
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            
            // More specific error messages
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Cannot connect to server. Make sure Django is running.');
            }
            
            throw error;
        }
    }

    // Authentication endpoints
    static async login(username, password) {
        return this.request('/auth/login/', {
            method: 'POST',
            body: { username, password },
        });
    }

    static async getCurrentUser() {
        return this.request('/auth/user/');
    }

    static async logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
    }

    // Attendance endpoints
    static async markAttendance(employeeId, action) {
        return this.request('/attendance/mark/', {
            method: 'POST',
            body: { 
                employee_id: employeeId,
                action: action, // 'check_in' or 'check_out'
                timestamp: new Date().toISOString()
            },
        });
    }

    static async getAttendance(employeeId, date = null) {
        let url = `/attendance/employee/${employeeId}/`;
        if (date) {
            url += `?date=${date}`;
        }
        return this.request(url);
    }

    static async getTodayAttendance() {
        return this.request('/attendance/today/');
    }

    // Employee endpoints
    static async getEmployees() {
        return this.request('/employees/');
    }

    static async getEmployeeProfile(employeeId) {
        return this.request(`/employees/${employeeId}/`);
    }

    // Department endpoints
    static async getDepartments() {
        return this.request('/departments/');
    }

    // Leave endpoints
    static async applyLeave(employeeId, leaveData) {
        return this.request('/leaves/apply/', {
            method: 'POST',
            body: {
                employee_id: employeeId,
                ...leaveData
            },
        });
    }

    static async getLeaves(employeeId) {
        return this.request(`/leaves/employee/${employeeId}/`);
    }

    static async getPendingLeaves() {
        return this.request('/leaves/pending/');
    }

    // Dashboard endpoints
    static async getDashboardStats() {
        return this.request('/dashboard/stats/');
    }

    static async getRecentActivities() {
        return this.request('/dashboard/activities/');
    }
}

// Enhanced Utility functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('[data-notification]');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.setAttribute('data-notification', 'true');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    } z-50 max-w-sm`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${getNotificationIcon(type)}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

function showLoading(container = null) {
    if (container) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-8">
                <div class="loading-spinner mb-4"></div>
                <p class="text-gray-600">Loading...</p>
            </div>
        `;
    } else {
        document.body.style.cursor = 'wait';
        
        // Add global loading overlay
        const overlay = document.createElement('div');
        overlay.id = 'global-loading';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-white rounded-lg p-6 flex flex-col items-center">
                <div class="loading-spinner mb-4"></div>
                <p class="text-gray-700">Please wait...</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }
}

function hideLoading(container = null) {
    if (container) {
        // Container loading handled by individual components
        return;
    } else {
        document.body.style.cursor = 'default';
        const overlay = document.getElementById('global-loading');
        if (overlay) {
            overlay.remove();
        }
    }
}

// Enhanced authentication check
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const currentPath = window.location.pathname;
    
    // Pages that don't require authentication
    const publicPages = ['/login.html', '/index.html', '/'];
    
    if (!token && !publicPages.some(page => currentPath.includes(page))) {
        window.location.href = 'login.html';
        return false;
    }
    
    // If we have a token but no user data, try to get user info
    if (token && !localStorage.getItem('userData')) {
        APIService.getCurrentUser()
            .then(user => {
                localStorage.setItem('userData', JSON.stringify(user));
            })
            .catch(error => {
                console.error('Failed to get user data:', error);
                // Token might be invalid, logout
                APIService.logout();
            });
    }
    
    return !!token;
}

// Get current user with fallback
function getCurrentUser() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            return JSON.parse(userData);
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
    
    // Return minimal user object if no data
    return {
        username: 'User',
        role: 'employee'
    };
}

// Check if user has specific role
function userHasRole(role) {
    const user = getCurrentUser();
    return user.role === role;
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return 'Invalid Date';
    }
}

// Format time for display
function formatTime(timeString) {
    if (!timeString) return '--:--';
    
    try {
        const [hours, minutes] = timeString.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    } catch (e) {
        return '--:--';
    }
}