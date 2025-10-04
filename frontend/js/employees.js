// Employee management functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    checkAuth();
    
    // Update user welcome message
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userWelcome').textContent = `Welcome, ${user.username}`;
    }

    // Load employee data from real API
    await loadEmployeesData();
    
    // Setup search functionality
    setupSearch();
});

async function loadEmployeesData() {
    try {
        showLoadingState();
        
        // Real API call to Django backend
        const employees = await APIService.getEmployees();
        
        displayEmployees(employees);
        
    } catch (error) {
        showNotification('Failed to load employee data', 'error');
        console.error('Employee data error:', error);
        
        // Show empty state on error
        const container = document.querySelector('.grid');
        const emptyState = document.getElementById('emptyState');
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        emptyState.innerHTML = `
            <div class="text-6xl mb-4">❌</div>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">Unable to load employees</h3>
            <p class="text-gray-500">Please check your connection and try again.</p>
        `;
    } finally {
        hideLoadingState();
    }
}

function displayEmployees(employees) {
    const container = document.querySelector('.grid');
    const emptyState = document.getElementById('emptyState');
    
    if (!employees || employees.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        emptyState.innerHTML = `
            <div class="text-6xl mb-4">👥</div>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">No employees found</h3>
            <p class="text-gray-500">No employee data available in the system.</p>
        `;
        return;
    }
    
    emptyState.classList.add('hidden');
    
    container.innerHTML = employees.map(employee => `
        <div class="bg-white rounded-xl shadow-lg p-6 dashboard-card">
            <div class="text-center mb-4">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span class="text-2xl text-blue-600">👤</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-800">${employee.user?.get_full_name || employee.user?.username || 'Unknown'}</h3>
                <p class="text-blue-600 font-medium">${employee.designation || 'Not specified'}</p>
                <p class="text-sm text-gray-500">${employee.department?.name || 'No department'}</p>
            </div>
            
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-500">Employee ID:</span>
                    <span class="font-medium">${employee.employee_id || 'N/A'}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Email:</span>
                    <span class="font-medium">${employee.user?.email || 'N/A'}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Phone:</span>
                    <span class="font-medium">${employee.user?.phone || 'N/A'}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Join Date:</span>
                    <span class="font-medium">${employee.join_date || 'N/A'}</span>
                </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">Status:</span>
                    <span class="status-badge status-present">
                        Active
                    </span>
                </div>
            </div>
            
            <div class="mt-4 flex gap-2">
                <button class="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition duration-300">
                    Profile
                </button>
                <button class="flex-1 bg-green-50 text-green-600 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition duration-300">
                    Attendance
                </button>
            </div>
        </div>
    `).join('');
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterEmployees(searchTerm);
    });
}

function filterEmployees(searchTerm) {
    const employeeCards = document.querySelectorAll('.grid > div');
    let visibleCount = 0;
    
    employeeCards.forEach(card => {
        const employeeName = card.querySelector('h3').textContent.toLowerCase();
        const employeeDesignation = card.querySelector('p.text-blue-600').textContent.toLowerCase();
        const employeeDepartment = card.querySelector('p.text-gray-500').textContent.toLowerCase();
        
        const matches = employeeName.includes(searchTerm) || 
                       employeeDesignation.includes(searchTerm) || 
                       employeeDepartment.includes(searchTerm);
        
        if (matches || searchTerm === '') {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show empty state if no matches
    const emptyState = document.getElementById('emptyState');
    if (visibleCount === 0 && searchTerm !== '') {
        emptyState.classList.remove('hidden');
        emptyState.innerHTML = `
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">No employees found</h3>
            <p class="text-gray-500">No employees match your search criteria.</p>
        `;
    } else {
        emptyState.classList.add('hidden');
    }
}

function showLoadingState() {
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('emptyState').classList.add('hidden');
}

function hideLoadingState() {
    document.getElementById('loadingState').classList.add('hidden');
}