from rest_framework import serializers
from .models import User, Profile, TranslationSession, TranslationAudio
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

""" User Register Serializer """
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    password2 = serializers.CharField(max_length=68, min_length=6, write_only=True)
    is_doctor = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'is_doctor']

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')

        if password != password2:
            raise serializers.ValidationError('Password and Confirm Password do not match.')

        try:
            validate_password(password)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({'password': list(e)})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
""" User Login Serializer """

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(read_only=True)
    is_doctor = serializers.BooleanField(read_only=True)
    access_token = serializers.CharField(max_length=255, read_only=True)
    refresh_token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        request = self.context.get('request')
        
        user = User.objects.filter(email=email).first()
        if not user:
            raise AuthenticationFailed('User with this email does not exist.')
        # Authenticate user
        user = authenticate(request, username=user.username, password=password)
        if not user:
            raise AuthenticationFailed('Invalid credentials or user does not exist.')

        if not user.is_active:
            raise AuthenticationFailed('User account is deactivated.')

        refresh = RefreshToken.for_user(user)

        return {
            'email': user.email,
            'username': user.username,
            'is_doctor': user.is_doctor,
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }
        
        
        
""" User Logout Serializer."""
class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

    default_error_messages = {
        'bad_token': 'Token is expired or invalid.'
    }

    def validate(self, attrs):
        self.token = attrs['refresh_token']
        return attrs

    def save(self, **kwargs):
        try:
            token = RefreshToken(self.token)
            token.blacklist()
        except TokenError:
            self.fail('bad_token')
            
            
            
""" User Profile Serializer """
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'is_patient', 'first_name', 'last_name', 'phone_number', 'profile_image', 'gender']
        extra_kwargs = {
            'profile_image': {'required': False, 'allow_null': True},
            'user': {'read_only': True},
        }

    def validate_phone_number(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Phone number must be a 10-digit number.")
        return value

    def create(self, validated_data):
        return Profile.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    
""" Translation Session Serializer """
class TranslationSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranslationSession
        fields = [
            'patient',
            'provider',
            'original_language',
            'translated_language',
            'original_text',
            'translated_text',
            'transcription_error'
        ]
        extra_kwargs = {
            'patient': {'read_only': True},  # Set patient from request.user in view
            'session_date': {'read_only': True}
        }

    def validate(self, data):
        if data['original_language'] == data['translated_language']:
            raise serializers.ValidationError("Original and translated languages must be different.")
        if not data['original_text']:
            raise serializers.ValidationError("Original text cannot be empty.")
        return data
    
""" Translation Audio Serializer """
class TranslationAudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranslationAudio
        fields = ['session', 'audio_file', 'uploaded_at']
        extra_kwargs = {
            'session': {'read_only': True},
            'uploaded_at': {'read_only': True}
        }

    def validate_audio_file(self, file):
        if file.size > 10 * 1024 * 1024:  # 10MB limit
            raise serializers.ValidationError("Audio file too large (limit: 10MB).")
        if not file.name.endswith(('.mp3', '.wav', '.m4a')):
            raise serializers.ValidationError("Unsupported file format. Allowed: mp3, wav, m4a.")
        return file

""" Language Serializer """
# class LanguageSerializer(serializers.ModelSerializer):
#     language = serializers.CharField(max_length=50)