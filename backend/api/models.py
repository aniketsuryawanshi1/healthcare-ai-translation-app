from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone


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


# User Profile Model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_patient = models.BooleanField(default=False,db_index=True)  # To distinguish between patient and healthcare provider
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=15)
    profile_image = models.ImageField(upload_to="Profile Images/", blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')])
    language = models.ForeignKey('Language', on_delete=models.SET_NULL, null=True, blank=True, related_name="user_profiles",db_index=True)  # Added language field

    def __str__(self):
        return self.user.username
    


class Language(models.Model):
    language_name = models.CharField(max_length=50)
    language_code = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.language_name} ({self.language_code})"


# Translation History (Chat)
class TranslationHistory(models.Model):
    patient = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='patient_messages')
    doctor = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='doctor_messages')
    original_text = models.TextField()
    translated_text = models.TextField()
    from_language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True, related_name="from_lang")
    to_language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True, related_name="to_lang")
    is_from_patient = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.ForeignKey('Message', on_delete=models.CASCADE, null=True, blank=True, related_name="translations")  # Added message field

    def __str__(self):
        sender = "Patient" if self.is_from_patient else "Doctor"
        return f"{sender} → {self.translated_text[:30]}..."


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    text = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True, related_name="messages")  # Added language field

    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username} at {self.timestamp}"