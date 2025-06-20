from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Profile,Language, TranslationHistory,Message
from .serializers import (
    RegisterSerializer, LoginSerializer, LogoutSerializer, ProfileSerializer, 
  TranslationHistorySerializer,MessageSerializer,LanguageSerializer
)
from .utils import translate_text
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404



""" User Registration View. """
class RegisterView(APIView):
    
    def post(self, request):
        # 1. Validate the request data using the RegisterSerializer.
        serializer = RegisterSerializer(data = request.data)
        
        # 2. Check if the serializer is valid.
        if serializer.is_valid(raise_exception=True):
            
            # 3. Save the user data to the database.
            serializer.save()
            
            # 4. Return a success response with the user data.
            return Response({
                'message': 'User has been registered successfully.',
                'user': serializer.data,
                            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
""" User Login View. """
class LoginView(APIView):
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            validated_data = serializer.validated_data
            login_message = "User logged in successfully"
            
            return Response({
                'message': login_message,
                **validated_data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
""" User Logout View. """
class LogoutView(APIView):
    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({
                'message': 'User logged out successfully'
            }, status=status.HTTP_204_NO_CONTENT)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

""" User Profile View. """
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({"message": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        if Profile.objects.filter(user=request.user).exists():
            return Response({"message": "Profile already exists."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
            return Response({
                'message': 'Profile has been created successfully.',
                'profile': serializer.data,
            }, status=status.HTTP_201_CREATED)

    def patch(self, request):
        """Partial update of the profile"""
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({"message": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({
                'message': 'Profile updated successfully.',
                'profile': serializer.data,
            }, status=status.HTTP_200_OK)
            

class LanguageListView(APIView):
    """
    API to list all supported languages.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        languages = Language.objects.all()
        serializer = LanguageSerializer(languages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PatientListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not request.user.profile.is_doctor:
            return Response({"error" : "Only doctors can viw the patient list."}, status=status.HTTP_403_FORBIDDEN)
        
        patients = Profile.objects.filter(is_patient=True)
        serializer = ProfileSerializer(patients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MessageView(APIView):
    """
    API to send and retrieve messages.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        """
        Send a message from patient to doctor or vice versa.
        """
        sender = request.user
        sender_profile = get_object_or_404(Profile, user=sender)
        text = request.data.get('text')

        if not text:
            return Response({"error": "Text is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Determine receiver based on sender role
        if sender_profile.is_patient:
            # Patient sending message to doctor (only one doctor)
            receiver_profile = Profile.objects.filter(is_doctor=True).first()
        elif sender_profile.is_doctor:
            # Doctor sending message to a specific patient
            receiver_profile = get_object_or_404(Profile, user__id=user_id, is_patient=True)
        else:
            return Response({"error": "Invalid user role."}, status=status.HTTP_400_BAD_REQUEST)

        if not receiver_profile:
            return Response({"error": "Receiver not found."}, status=status.HTTP_404_NOT_FOUND)

        receiver = receiver_profile.user

        # Translate message if needed
        sender_language = sender_profile.language.language_code
        receiver_language = receiver_profile.language.language_code
        translated_text = translate_text(text, sender_language, receiver_language) \
            if sender_language != receiver_language else text

        # Create the message
        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            text=text,
            translated_text=translated_text,
            language=sender_profile.language
        )

        # Identify doctor and patient roles
        doctor_profile = sender_profile if sender_profile.is_doctor else receiver_profile
        patient_profile = sender_profile if sender_profile.is_patient else receiver_profile
        is_from_patient = sender_profile.is_patient

        # Save translation history
        TranslationHistory.objects.create(
            patient=patient_profile,
            doctor=doctor_profile,
            original_text=text,
            translated_text=translated_text,
            from_language=sender_profile.language,
            to_language=receiver_profile.language,
            is_from_patient=is_from_patient,
            message=message
        )

        return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)

    def get(self, request, user_id):
        """
        Retrieve messages between authenticated user and other user.
        """
        user = request.user
        if not user.profile.is_doctor and not user.profile.is_patient:
            return Response({"error": "Unauthorized access."}, status=status.HTTP_403_FORBIDDEN)

        messages = Message.objects.filter(
            sender_id__in=[user.id, user_id],
            receiver_id__in=[user.id, user_id]
        ).order_by('timestamp')

        messages.filter(receiver=user, is_read=False).update(is_read=True)

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
class TranslationHistoryView(APIView):
    """
    API to retrieve translation history.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve translation history for the authenticated user.
        """
        user = request.user
        profile = Profile.objects.get(user=user)

        user = request.user
        profile = Profile.objects.get(user=user)

        if profile.is_patient:
            translations = TranslationHistory.objects.filter(patient=profile).select_related('from_language', 'to_language', 'message').order_by('-created_at')
        else:
            translations = TranslationHistory.objects.filter(doctor=profile).select_related('from_language', 'to_language', 'message').order_by('-created_at')

        serializer = TranslationHistorySerializer(translations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class MessagePagination(PageNumberPagination):
    page_size = 10

class MessageListView(ListAPIView):
    """
    API to retrieve paginated messages for the authenticated user.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    pagination_class = MessagePagination

    def get_queryset(self):
        return Message.objects.filter(receiver=self.request.user).order_by('-timestamp')
    
class TranslationHistoryPagination(PageNumberPagination):
    page_size = 10

class TranslationHistoryListView(ListAPIView):
    """
    API to retrieve paginated translation history for the authenticated user.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TranslationHistorySerializer
    pagination_class = TranslationHistoryPagination

    def get_queryset(self):
        user = self.request.user
        profile = Profile.objects.get(user=user)

        if profile.is_patient:
            return TranslationHistory.objects.filter(patient=profile).order_by('-created_at')
        else:
            return TranslationHistory.objects.filter(doctor=profile).order_by('-created_at')