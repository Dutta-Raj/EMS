from django.contrib import admin
from .models import Attendance, Leave

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'date', 'check_in', 'check_out', 'status']
    list_filter = ['date', 'status', 'employee__department']
    search_fields = ['employee__user__username', 'employee__user__first_name']

@admin.register(Leave)
class LeaveAdmin(admin.ModelAdmin):
    list_display = ['employee', 'leave_type', 'start_date', 'end_date', 'status']
    list_filter = ['status', 'leave_type', 'start_date']
    search_fields = ['employee__user__username', 'reason']