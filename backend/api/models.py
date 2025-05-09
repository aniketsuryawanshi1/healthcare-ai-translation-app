from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from rest_framework_simplejwt.tokens import RefreshToken

# AUTH_PROVIDERS setup
AUTH_PROVIDERS = {
    'email': 'email',
}

# Custom Manager for User
class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Please provide an email address')
        if not username:
            raise ValueError('Please provide a username')

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_verified', True)
        
        # Default superuser permissions
        extra_fields.setdefault('can_create', True)
        extra_fields.setdefault('can_update', True)
        extra_fields.setdefault('can_delete', True)
        extra_fields.setdefault('can_read', True)

        return self.create_user(username, email, password, **extra_fields)


# Custom User model
class User(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key=True, editable=False)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    auth_provider = models.CharField(max_length=50, blank=False, null=False, default=AUTH_PROVIDERS.get('email'))
    is_patient = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

    def __str__(self):
        return self.email

    # Adding related_name to avoid clashes with built-in Group and Permission models
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',
        blank=True,
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_set',
        blank=True,
    )


# Language model to store supported languages for translation
class Language(models.Model):
    code = models.CharField(max_length=10, unique=True)  # e.g. 'en' for English, 'es' for Spanish
    name = models.CharField(max_length=50)  # e.g. 'English', 'Spanish'

    def __str__(self):
        return self.name


# User Profile Model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_patient = models.BooleanField(default=False)  # To distinguish between patient and healthcare provider
    language_preference = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.user.username


# Translation Session Model to store translation/transcription history
class TranslationSession(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_sessions')
    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name='provider_sessions')
    session_date = models.DateTimeField(auto_now_add=True)
    original_language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True, related_name='original_language')
    translated_language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True, related_name='translated_language')
    original_text = models.TextField()  # The text transcribed from the user's speech
    translated_text = models.TextField()  # The translated version of the text
    transcription_error = models.BooleanField(default=False)  # Tracks if an error occurred in transcription

    def __str__(self):
        return f"Session {self.id} - {self.patient.username} to {self.provider.username}"



# Audio Model to store audio files related to the translation sessions (optional)
class TranslationAudio(models.Model):
    session = models.ForeignKey(TranslationSession, on_delete=models.CASCADE)
    audio_file = models.FileField(upload_to='translation_audio/')  # Store audio file for playback
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Audio for session {self.session.id}"

