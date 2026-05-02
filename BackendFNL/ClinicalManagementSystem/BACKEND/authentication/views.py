




from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import LoginSerializer
from rest_framework.permissions import AllowAny


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(username=username, password=password)

            if user is not None:
                refresh = RefreshToken.for_user(user)

                #  GET ROLE NAME FROM GROUP
                group = user.groups.first()
                role = group.name if group else None

                response = {
                    "status": status.HTTP_200_OK,
                    "message": "success",
                    "username": user.username,
                    "role": role,  # FIXED
                    "data": {
                        "access": str(refresh.access_token),
                        "refresh": str(refresh)
                    }
                }

                return Response(response, status=status.HTTP_200_OK)

            else:
                return Response({
                    "status": status.HTTP_401_UNAUTHORIZED,
                    "message": "Invalid username or password!"
                }, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            "status": status.HTTP_400_BAD_REQUEST,
            "message": "bad request",
            "data": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
