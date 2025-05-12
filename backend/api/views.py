from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Profile, TranslationSession, TranslationAudio,LANGUAGE_CHOICES, Language
from .serializers import (
    RegisterSerializer, LoginSerializer, LogoutSerializer, ProfileSerializer, 
    TranslationSessionSerializer, TranslationAudioSerializer
)
from .utils import translate_text,text_to_speech
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated

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

""" Language List View. """
class LanguageListView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        language_choices = [{"value":key, "label" : value} for key, value in LANGUAGE_CHOICES]
        return Response({
            "language_choices" : language_choices,
        }, status=status.HTTP_200_OK)
    
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
            

""" Translation Session View. """
class TranslationSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Handles patient speech → text → translation → doctor.
        """
        patient = request.user
        provider_id = request.data.get("provider_id")
        original_text = request.data.get("original_text")
        original_lang_code = request.data.get("original_language")
        target_lang_code = request.data.get("translated_language")

        try:
            provider = User.objects.get(id=provider_id)
            source_lang = Language.objects.get(code=original_lang_code)
            target_lang = Language.objects.get(code=target_lang_code)
        except (User.DoesNotExist, Language.DoesNotExist):
            return Response({"error": "Invalid provider or language code."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            translated_text = translate_text(original_text, original_lang_code, target_lang_code)
        except Exception as e:
            return Response({"error": "Translation failed.", "details": str(e)}, status=500)

        # Create the Translation Session
        session = TranslationSession.objects.create(
            patient=patient,
            provider=provider,
            original_language=source_lang,
            translated_language=target_lang,
            original_text=original_text,
            translated_text=translated_text
        )

        # Validate and serialize session data
        session_serializer = TranslationSessionSerializer(session)
        if not session_serializer.is_valid():
            return Response(session_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Optional: Generate audio for doctor
        audio_path = text_to_speech(translated_text, target_lang_code)
        if audio_path:
            audio = TranslationAudio.objects.create(session=session, audio_file=audio_path)
            # Serialize audio data
            audio_serializer = TranslationAudioSerializer(audio)
            return Response({
                "message": "Translation saved.",
                "session_id": session.id,
                "original_text": original_text,
                "translated_text": translated_text,
                "audio_file": audio_serializer.data['audio_file']
            }, status=status.HTTP_201_CREATED)
        return Response({
            "message": "Translation saved.",
            "session_id": session.id,
            "original_text": original_text,
            "translated_text": translated_text
        }, status=status.HTTP_201_CREATED)

    def patch(self, request):
        """
        Handles doctor reply translation → patient language + audio.
        """
        session_id = request.data.get("session_id")
        reply_text = request.data.get("reply_text")

        try:
            session = TranslationSession.objects.get(id=session_id)
        except TranslationSession.DoesNotExist:
            return Response({"error": "Session not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            translated_reply = translate_text(
                reply_text,
                session.translated_language.code,
                session.original_language.code
            )
        except Exception as e:
            return Response({"error": "Reply translation failed.", "details": str(e)}, status=500)

        # Optional: Generate audio for patient
        audio_path = text_to_speech(translated_reply, session.original_language.code)
        if audio_path:
            audio = TranslationAudio.objects.create(session=session, audio_file=audio_path)
            # Serialize audio data
            audio_serializer = TranslationAudioSerializer(audio)
            return Response({
                "message": "Reply translated successfully.",
                "original_reply": reply_text,
                "translated_reply": translated_reply,
                "audio_file": audio_serializer.data['audio_file'],
                "patient_language": session.original_language.code
            }, status=status.HTTP_200_OK)
        
        return Response({
            "message": "Reply translated successfully.",
            "original_reply": reply_text,
            "translated_reply": translated_reply,
            "patient_language": session.original_language.code
        }, status=status.HTTP_200_OK)
        
""" Translation Audio View. """
class TranslationAudioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id=None):
        """
        GET request to fetch audio files.
        - If session_id is provided, return the audio for that session.
        - If session_id is not provided, return all audio files related to the logged-in user.
        """
        user = request.user
        is_patient = hasattr(user, 'patient')  # Check if user is a patient (based on your model setup)
        is_doctor = hasattr(user, 'doctor')  # Check if user is a doctor (based on your model setup)
        is_superuser = user.is_superuser  # Check if the user is a superuser

        if session_id:
            # Get a single audio file by session_id
            try:
                audio = TranslationAudio.objects.get(session__id=session_id)

                # Superuser can access all audio files
                if is_superuser:
                    pass  # No restrictions for superuser
                
                # Restrict access based on user role
                elif is_patient and audio.session.patient != user:
                    return Response({"error": "You are not authorized to access this audio."}, status=status.HTTP_403_FORBIDDEN)
                elif is_doctor and audio.session.provider != user:
                    return Response({"error": "You are not authorized to access this audio."}, status=status.HTTP_403_FORBIDDEN)

                with open(audio.audio_file.path, 'rb') as f:
                    response = HttpResponse(f.read(), content_type="audio/mpeg")
                    response['Content-Disposition'] = f'attachment; filename="{audio.audio_file.name}"'
                    return response

            except TranslationAudio.DoesNotExist:
                return Response({"error": "Audio not found."}, status=status.HTTP_404_NOT_FOUND)

        else:
            # Get all audio files related to the user (patient or doctor)
            if is_superuser:
                # Superuser can access all audio files
                audio_files = TranslationAudio.objects.all()
            elif is_patient:
                # A patient can only access their own audio files
                audio_files = TranslationAudio.objects.filter(session__patient=user)
            elif is_doctor:
                # A doctor can access audio files of their patients
                audio_files = TranslationAudio.objects.filter(session__provider=user)
            else:
                return Response({"error": "User role is not recognized."}, status=status.HTTP_400_BAD_REQUEST)

            # Serialize and return the list of audio files
            serializer = TranslationAudioSerializer(audio_files, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, session_id):
        """
        DELETE request to delete an audio file for a session.
        """
        try:
            audio = TranslationAudio.objects.get(session__id=session_id)
        except TranslationAudio.DoesNotExist:
            return Response({"error": "Audio not found."}, status=status.HTTP_404_NOT_FOUND)

        # Superuser can delete any audio file
        if request.user.is_superuser:
            audio.delete()
            return Response({"message": "Audio file deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

        # Only allow deletion if the user is associated with the session (patient or doctor)
        if audio.session.patient == request.user or audio.session.provider == request.user:
            audio.delete()
            return Response({"message": "Audio file deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "You are not authorized to delete this audio."}, status=status.HTTP_403_FORBIDDEN)
        