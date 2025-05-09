from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, LogoutSerializer
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