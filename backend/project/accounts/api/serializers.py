from asyncore import read
from django.utils.translation import gettext as _

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from accounts.models import Account
from data.models import Business, Employee, OpenHours
from data.api.serializers import CustomerSerializer


class UniqueEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(validators=[
        UniqueValidator(queryset=Account.objects.all(),
                        message=_('Given address email is already in use'))
    ])


class AccountBusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ('id', 'name', 'city', 'address')


class AccountSerializer(serializers.ModelSerializer):
    # Return profile
    profile = CustomerSerializer()
    businesses = serializers.SerializerMethodField()

    def get_businesses(self, obj):
        return AccountBusinessSerializer(obj.businesses.all(), many=True).data

    class Meta:
        model = Account
        exclude = (
            'password',
            'is_superuser',
            'is_staff',
        )


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = (
            'email',
            'password',
            'name',
        )
        extra_kwargs = {
            'password': {
                'write_only': True
            },
        }

    def create(self, data):
        email = data['email']
        password = data['password']

        return Account.objects.create_user(email=email, password=password)
