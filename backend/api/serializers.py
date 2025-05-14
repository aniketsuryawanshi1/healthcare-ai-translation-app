from rest_framework import serializers
from .models import User, Profile, Language, TranslationHistory,Message
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

""" User Register Serializer """
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    password2 = serializers.CharField(max_length=68, min_length=6, write_only=True)
    

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', ]


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
        email = validated_data.get('email')

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "This email is already registered."})

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
    is_patient = serializers.BooleanField(read_only=True)
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
            'is_patient': user.is_patient,
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
        fields = ['id','user', 'is_patient','is_doctor', 'first_name', 'last_name', 'phone_number', 'profile_image', 'gender', 'language']
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

""" Language Serializer """
class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'language_name', 'language_code']

""" Message Serializer """
class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)
    receiver = serializers.StringRelatedField(read_only=True)
    language = LanguageSerializer(read_only=True)

    class Meta:
        model = Message
        fields = fields = ['id', 'sender', 'receiver', 'language', 'text', 'translated_text', 'is_read', 'timestamp']

    def validate(self, attrs):
        if not attrs.get('text') and not attrs.get('translated_text'):
            raise serializers.ValidationError("Message text cannot be empty.")
        return attrs

    def create(self, validated_data):
        return Message.objects.create(**validated_data)

""" Translation History Serializer """
class TranslationHistorySerializer(serializers.ModelSerializer):
    patient = serializers.StringRelatedField(read_only=True)
    doctor = serializers.StringRelatedField(read_only=True)
    from_language = LanguageSerializer(read_only=True)
    to_language = LanguageSerializer(read_only=True)
    message = MessageSerializer(read_only=True)

    class Meta:
        model = TranslationHistory
        fields = [
            'id', 'patient', 'doctor', 'original_text', 'translated_text',
            'from_language', 'to_language', 'is_from_patient', 'created_at', 'message'
        ]
    
    def create(self, validated_data):
        return TranslationHistory.objects.create(**validated_data)