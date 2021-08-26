from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.contrib import auth

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, generics, status
from rest_framework.exceptions import ValidationError

from . import serializers


class CurrentAccountAPIView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = serializers.AccountSerializer

    def get_object(self):
        return self.request.user


@method_decorator(csrf_protect, name='dispatch')
class RegisterAPIView(generics.CreateAPIView):
    serializer_class = serializers.RegisterSerializer


@method_decorator(csrf_protect, name='dispatch')
class LoginAPIView(APIView):
    def post(self, request, format=None):
        data = request.data

        email = data['email']
        password = data['password']

        user = auth.authenticate(email=email, password=password)

        if user is not None:
            auth.login(request, user)

            return Response(
                {
                    'message': 'Pomyślnie zalogowano',
                    'user': serializers.AccountSerializer(user).data,
                },
                status=status.HTTP_200_OK)
        raise ValidationError({'detail': 'Email lub hasło jest niepoprawne'})


@method_decorator(csrf_protect, name='dispatch')
class LogoutAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def post(self, request, format=None):
        auth.logout(request)

        return Response({'message': 'Pomyślnie wylogowano'})
