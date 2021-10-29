from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers


class ValidatePhoneSerializer(serializers.Serializer):
    phone_number = PhoneNumberField()