// API functions
const API_BASE = 'http://127.0.0.1:8000/api';

async function fetchDashboardData() {
    try {
        const response = await fetch(`${API_BASE}/dashboard/`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return null;
    }
}

async function fetchAttendanceData() {
    try {
        const response = await fetch(`${API_BASE}/attendance/`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        return [];
    }
}

// Export for use in other files
window.API = {
    fetchDashboardData,
    fetchAttendanceData
};