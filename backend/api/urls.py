from django.urls import path
from . import views
from rest_framework_simplejwt.views import (TokenRefreshView,)


urlpatterns = [

    # Token Refresh view
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # User Registration
    path('register/', views.RegisterView.as_view(), name='register'),
    # User Login
    path('login/', views.LoginView.as_view(), name='login'),
    # User Logout
    path('logout/', views.LogoutView.as_view(), name='logout'),
]
