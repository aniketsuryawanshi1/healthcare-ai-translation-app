from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Token Refresh view
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User Registration
    path('register/', views.RegisterView.as_view(), name='register'),
    
    # User Login
    path('login/', views.LoginView.as_view(), name='login'),
    
    # User Logout
    path('logout/', views.LogoutView.as_view(), name='logout'),
    
    # Language List
    path('languages/', views.LanguageListView.as_view(), name='language-list'),
    
    # User Profile
    path('profile/', views.ProfileView.as_view(), name='profile'),
    
    # Patient List
    path('patients/', views.PatientListView.as_view(), name='patient-list'),
    
    # Message History
    path('messages/<int:user_id>/', views.MessageView.as_view(), name='message-list'),
    
    # Translation History
    path('translations/', views.TranslationHistoryListView.as_view(), name='translation-history'),
]
