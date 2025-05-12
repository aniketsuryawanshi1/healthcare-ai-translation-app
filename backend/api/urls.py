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
    
    # Translation Session
    path('translation/session/', views.TranslationSessionView.as_view(), name='translation-session'),
    
    # Translation Audio
    path('translation/audio/<int:session_id>/', views.TranslationAudioView.as_view(), name='translation-audio'),
    path('translation/audio/', views.TranslationAudioView.as_view(), name='translation-audio-list'),
]
