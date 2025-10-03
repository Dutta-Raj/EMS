// Attendance functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    checkAuth();
    
    // Update user welcome message
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userWelcome').textContent = `Welcome, ${user.username}`;
    }

    // Load attendance data
    await loadAttendanceData();
    
    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Check-in button
    document.getElementById('checkInBtn').addEventListener('click', markCheckIn);
    
    // Check-out button
    document.getElementById('checkOutBtn').addEventListener('click', markCheckOut);
    
    // Filter buttons
    document.getElementById('filterBtn').addEventListener('click', applyDateFilter);
    document.getElementById('resetFilter').addEventListener('click', resetDateFilter);
}

async function markCheckIn() {
    try {
        showLoading();
        const user = getCurrentUser();
        
        // Simulate API call (replace with actual API)
        const result = await simulateMarkAttendance(user.id, 'check_in');
        
        showNotification('Checked in successfully!', 'success');
        updateCurrentStatus('checked_in', result.timestamp);
        await loadAttendanceData(); // Refresh data
        
    } catch (error) {
        showNotification('Failed to check in', 'error');
        console.error('Check-in error:', error);
    } finally {
        hideLoading();
    }
}

async function markCheckOut() {
    try {
        showLoading();
        const user = getCurrentUser();
        
        // Simulate API call (replace with actual API)
        const result = await simulateMarkAttendance(user.id, 'check_out');
        
        showNotification('Checked out successfully!', 'success');
        updateCurrentStatus('checked_out', result.timestamp);
        await loadAttendanceData(); // Refresh data
        
    } catch (error) {
        showNotification('Failed to check out', 'error');
        console.error('Check-out error:', error);
    } finally {
        hideLoading();
    }
}

async function loadAttendanceData(date = null) {
    try {
        showLoadingState();
        
        const user = getCurrentUser();
        // Simulate API call (replace with actual API)
        const attendanceData = await simulateGetAttendance(user.id, date);
        
        updateAttendanceTable(attendanceData);
        updateCurrentStatusDisplay(attendanceData);
        
    } catch (error) {
        showNotification('Failed to load attendance data', 'error');
        console.error('Attendance data error:', error);
    } finally {
        hideLoadingState();
    }
}

function updateAttendanceTable(attendanceData) {
    const tableBody = document.getElementById('attendanceTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (attendanceData.length === 0) {
        tableBody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    tableBody.innerHTML = attendanceData.map(record => `
        <tr class="border-b border-gray-200 hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-700">${formatDate(record.date)}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${record.check_in || '--:--'}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${record.check_out || '--:--'}</td>
            <td class="px-4 py-3">
                <span class="status-badge status-${record.status}">${record.status}</span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">${calculateHours(record.check_in, record.check_out)}</td>
        </tr>
    `).join('');
}

function updateCurrentStatusDisplay(attendanceData) {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendanceData.find(record => record.date === today);
    
    if (todayRecord) {
        updateCurrentStatus(todayRecord.status, todayRecord.check_in, todayRecord.check_out);
    } else {
        updateCurrentStatus('not_checked_in');
    }
}

function updateCurrentStatus(status, checkInTime = null, checkOutTime = null) {
    const statusElement = document.getElementById('currentStatus');
    const checkInTimeElement = document.getElementById('checkInTime');
    const checkOutTimeElement = document.getElementById('checkOutTime');
    
    // Update check-in/check-out times
    if (checkInTime) {
        checkInTimeElement.textContent = `Last: ${checkInTime}`;
    }
    if (checkOutTime) {
        checkOutTimeElement.textContent = `Last: ${checkOutTime}`;
    }
    
    // Update status message
    switch(status) {
        case 'checked_in':
            statusElement.className = 'mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center';
            statusElement.innerHTML = '<p class="text-green-800 font-semibold">✅ You are currently checked in</p>';
            break;
        case 'checked_out':
            statusElement.className = 'mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center';
            statusElement.innerHTML = '<p class="text-blue-800 font-semibold">🔵 You have checked out for today</p>';
            break;
        default:
            statusElement.className = 'mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center';
            statusElement.innerHTML = '<p class="text-yellow-800">⏰ You haven\'t checked in today</p>';
    }
}

function applyDateFilter() {
    const date = document.getElementById('dateFilter').value;
    loadAttendanceData(date);
}

function resetDateFilter() {
    document.getElementById('dateFilter').value = '';
    loadAttendanceData();
}

function showLoadingState() {
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('emptyState').classList.add('hidden');
}

function hideLoadingState() {
    document.getElementById('loadingState').classList.add('hidden');
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function calculateHours(checkIn, checkOut) {
    if (!checkIn || !checkOut) return '--';
    
    const [inHour, inMinute] = checkIn.split(':').map(Number);
    const [outHour, outMinute] = checkOut.split(':').map(Number);
    
    const totalMinutes = (outHour * 60 + outMinute) - (inHour * 60 + inMinute);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
}

// Simulate API calls (replace with actual API calls)
function simulateMarkAttendance(userId, action) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const now = new Date();
            resolve({
                success: true,
                timestamp: now.toLocaleTimeString('en-US', { hour12: false }),
                action: action
            });
        }, 1000);
    });
}

function simulateGetAttendance(userId, date = null) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Generate mock attendance data
            const records = [];
            const today = new Date();
            
            for (let i = 0; i < 14; i++) {
                const recordDate = new Date(today);
                recordDate.setDate(today.getDate() - i);
                const dateStr = recordDate.toISOString().split('T')[0];
                
                // Skip weekends randomly
                if (Math.random() > 0.3) {
                    records.push({
                        date: dateStr,
                        check_in: '09:' + (Math.floor(Math.random() * 30)).toString().padStart(2, '0'),
                        check_out: '17:' + (Math.floor(Math.random() * 30)).toString().padStart(2, '0'),
                        status: ['present', 'present', 'present', 'late'][Math.floor(Math.random() * 4)]
                    });
                }
            }
            
            // Filter by date if provided
            const filteredRecords = date ? records.filter(record => record.date === date) : records;
            resolve(filteredRecords);
        }, 1500);
    });
}