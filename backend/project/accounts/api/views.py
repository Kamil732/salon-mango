from calendar import week, weekday
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.utils.translation import gettext as _
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
        weekday = data['weekday']

        user = auth.authenticate(email=email, password=password)

        if user is not None:
            auth.login(request, user)

            return Response(
                {
                    'message':
                    _('Logged in successfully'),
                    'user':
                    serializers.AccountSerializer(user,
                                                  context={
                                                      'weekday': weekday
                                                  }).data,
                },
                status=status.HTTP_200_OK)
        raise ValidationError({'detail': _('Email or password is incorrect')})


@method_decorator(csrf_protect, name='dispatch')
class LogoutAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def post(self, request, format=None):
        auth.logout(request)

        return Response({'message': _('Logged out successfully')})


class AccountExistsAPIView(APIView):
    def get(self, request, format=None):
        email = request.query_params.get('email')

        serializer = serializers.UniqueEmailSerializer(data={'email': email})
        serializer.is_valid(raise_exception=True)

        return Response({'exists': False})