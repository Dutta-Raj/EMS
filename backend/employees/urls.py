from django.contrib import admin
from django.urls import path, re_path
from employees import views as employees_views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Frontend Routes
    path('', employees_views.serve_frontend, name='home'),
    path('dashboard/', employees_views.serve_frontend, name='dashboard'),
    path('attendance/', employees_views.serve_frontend, name='attendance'),
    
    # API Routes
    path('api/dashboard/', employees_views.dashboard_api, name='dashboard_api'),
    path('api/attendance/', employees_views.attendance_api, name='attendance_api'),
    path('api/employees/', employees_views.employees_api, name='employees_api'),
    
    # Static files pattern - FIXED
    re_path(r'^assets/(?P<file_path>.*)$', employees_views.serve_static_file, name='static_files'),
]