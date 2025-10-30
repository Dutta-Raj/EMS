from django.shortcuts import render
from .models import Employee, Department, Attendance, Leave

# Employee list view
def employee_list(request):
    employees = Employee.objects.all()
    return render(request, 'employees/employee_list.html', {'employees': employees})

# Department list view
def department_list(request):
    departments = Department.objects.all()
    return render(request, 'employees/department_list.html', {'departments': departments})

# Dashboard view
def dashboard(request):
    total_employees = Employee.objects.count()
    total_departments = Department.objects.count()
    # ✅ Fixed: active_employees should filter based on your model field
    active_employees = Employee.objects.filter(is_active=True).count()

    context = {
        'total_employees': total_employees,
        'total_departments': total_departments,
        'active_employees': active_employees,
    }
    return render(request, 'employees/dashboard.html', context)
