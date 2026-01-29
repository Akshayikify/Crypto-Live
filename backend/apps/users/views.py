from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from utils.security import ClerkAuthentication
from .models import User
from .serializers import UserSerializer

class UserMeView(APIView):
    authentication_classes = [ClerkAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # request.user is set by ClerkAuthentication
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
