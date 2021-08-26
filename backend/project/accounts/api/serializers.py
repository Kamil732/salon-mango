from django.contrib.auth.models import User
from rest_framework import serializers

from accounts.models import Account
from data.api.serializers import CustomerSerializer


class AccountSerializer(serializers.ModelSerializer):
    # Return profile
    profile = CustomerSerializer()

    class Meta:
        model = Account
        exclude = (
            'password',
            'is_superuser',
            'is_staff',
        )


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if not (data['password'] == data['password2']):
            raise serializers.ValidationError(
                {'password': 'passwords are not the same'})

        return data

    class Meta:
        model = User
        fields = (
            'email',
            'password',
            'password2',
        )

    def create(self, data):
        email = data['email']
        password = data['password']

        return Account.objects.create_user(email=email, password=password)
