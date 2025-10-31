from django.urls import path 
from . import views 
 
urlpatterns = [ 
    path('login/', views.login_view, name='login'), 
    path('logout/', views.logout_view, name='logout'), 
    path('signup/', views.signup_view, name='signup'), 
    path('', views.dashboard, name='dashboard'), 
    path('employees/', views.employee_list, name='employee_list'), 
    path('departments/', views.department_list, name='department_list'), 
] 
