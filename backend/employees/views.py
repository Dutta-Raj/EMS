from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import os
from django.conf import settings

# Serve Frontend Pages
@csrf_exempt
def serve_frontend(request, page=None):
    try:
        # Determine which HTML file to serve
        if 'attendance' in request.path:
            filename = 'attendance.html'
        elif 'dashboard' in request.path:
            filename = 'dashboard.html'
        else:
            filename = 'dashboard.html'  # Default page
        
        # Path to frontend files
        file_path = os.path.join(settings.BASE_DIR, '..', 'frontend', filename)
        
        with open(file_path, 'r', encoding='utf-8') as file:
            return HttpResponse(file.read(), content_type='text/html')
            
    except FileNotFoundError:
        return HttpResponse(f"Page {filename} not found", status=404)
    except Exception as e:
        return HttpResponse(f"Error loading page: {str(e)}", status=500)

# Serve static files (CSS, JS, etc.) - ADD THIS FUNCTION
@csrf_exempt
def serve_static_file(request, file_path):
    try:
        # Path to frontend static files
        full_path = os.path.join(settings.BASE_DIR, '..', 'frontend', file_path)
        
        # Determine content type
        if file_path.endswith('.css'):
            content_type = 'text/css'
        elif file_path.endswith('.js'):
            content_type = 'application/javascript'
        elif file_path.endswith('.png'):
            content_type = 'image/png'
        elif file_path.endswith('.jpg') or file_path.endswith('.jpeg'):
            content_type = 'image/jpeg'
        elif file_path.endswith('.gif'):
            content_type = 'image/gif'
        elif file_path.endswith('.ico'):
            content_type = 'image/x-icon'
        else:
            content_type = 'text/plain'
        
        with open(full_path, 'rb') as file:
            return HttpResponse(file.read(), content_type=content_type)
            
    except FileNotFoundError:
        return HttpResponse(f"File {file_path} not found", status=404)
    except Exception as e:
        return HttpResponse(f"Error loading file: {str(e)}", status=500)

# API Views
@csrf_exempt
@require_http_methods(["GET"])
def dashboard_api(request):
    """API for dashboard data"""
    data = {
        "total_employees": 0,
        "present_today": 0,
        "on_leave": 0,
        "recent_activities": []
    }
    return JsonResponse(data)

@csrf_exempt
@require_http_methods(["GET"])
def attendance_api(request):
    """API for attendance data"""
    return JsonResponse([])

@csrf_exempt
@require_http_methods(["GET", "POST"])
def employees_api(request):
    """API for employees data"""
    if request.method == "GET":
        return JsonResponse([])
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            return JsonResponse({"success": True, "data": data})
        except:
            return JsonResponse({"error": "Invalid data"}, status=400)