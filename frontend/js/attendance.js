// Attendance functionality
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Attendance page loaded');
    
    // Load attendance data
    const data = await window.API.fetchAttendanceData();
    console.log('Attendance data:', data);
    
    // Check-in/Check-out buttons
    const checkInBtn = document.getElementById('checkInBtn');
    const checkOutBtn = document.getElementById('checkOutBtn');
    
    if (checkInBtn) {
        checkInBtn.addEventListener('click', function() {
            const now = new Date().toLocaleTimeString();
            document.getElementById('checkInTime').textContent = `Checked in at: ${now}`;
            alert(`Checked in at ${now}`);
        });
    }
    
    if (checkOutBtn) {
        checkOutBtn.addEventListener('click', function() {
            const now = new Date().toLocaleTimeString();
            document.getElementById('checkOutTime').textContent = `Checked out at: ${now}`;
            alert(`Checked out at ${now}`);
        });
    }
});