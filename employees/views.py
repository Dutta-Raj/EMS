from django.shortcuts import render, redirect 
from django.contrib.auth import authenticate, login, logout 
from django.contrib.auth.decorators import login_required 
from django.contrib.auth.models import User 
from django.contrib import messages 
from .models import Employee, Department 
 
def login_view(request): 
    if request.user.is_authenticated: 
        return redirect('dashboard') 
 
    if request.method == 'POST': 
        username = request.POST.get('username') 
        password = request.POST.get('password') 
        user = authenticate(request, username=username, password=password) 
 
        if user is not None: 
            login(request, user) 
            return redirect('dashboard') 
        else: 
            return render(request, 'employees/login.html', {'error': 'Invalid username or password'}) 
 
    return render(request, 'employees/login.html') 
 
def logout_view(request): 
    logout(request) 
    return redirect('login') 
 
def signup_view(request): 
    if request.user.is_authenticated: 
        return redirect('dashboard') 
 
    if request.method == 'POST': 
        username = request.POST.get('username') 
        email = request.POST.get('email') 
        password1 = request.POST.get('password1') 
        password2 = request.POST.get('password2') 
 
        if password1 == password2: 
            if User.objects.filter(username=username).exists(): 
                return render(request, 'employees/signup.html', {'error': 'Username already exists'}) 
            elif User.objects.filter(email=email).exists(): 
                return render(request, 'employees/signup.html', {'error': 'Email already registered'}) 
            else: 
                user = User.objects.create_user(username=username, email=email, password=password1) 
                user.is_staff = False  
                user.is_superuser = False  
                user.save() 
                messages.success(request, 'Account created successfully! Please login.') 
                return redirect('login') 
        else: 
            return render(request, 'employees/signup.html', {'error': 'Passwords do not match'}) 
 
    return render(request, 'employees/signup.html') 
 
@login_required 
def dashboard(request): 
    employees_count = Employee.objects.count() 
    departments_count = Department.objects.count() 
    return render(request, 'employees/dashboard.html', { 
        'employees_count': employees_count, 
        'departments_count': departments_count 
    }) 
 
@login_required 
def employee_list(request): 
    employees = Employee.objects.all() 
    return render(request, 'employees/employee_list.html', {'employees': employees}) 
 
@login_required 
def department_list(request): 
    return render(request, 'employees/department_list.html') 
