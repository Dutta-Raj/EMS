from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render

# Simple homepage (optional)
def home(request):
    return render(request, 'index.html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('employees.urls')),   # ✅ add this line
    path('home/', home, name='home'),      # optional, if you want to keep your old index.html route
]
