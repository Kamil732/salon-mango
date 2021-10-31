from django.utils.translation import gettext as _

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from accounts.models import Account
from data.models import Business, Employee
from data.api.serializers import CustomerSerializer


class UniqueEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(validators=[
        UniqueValidator(queryset=Account.objects.all(),
                        message=_('Given address email is already in use'))
    ])


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
    password = serializers.CharField()

    class Meta:
        model = Account
        fields = ('email', 'password')
        extra_kwargs = {
            'password': {
                'write_only': True
            },
        }

    def create(self, data):
        email = data['email']
        password = data['password']

        return Account.objects.create_user(email=email, password=password)
