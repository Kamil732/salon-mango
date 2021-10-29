from django.http.response import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from . import serializers


@ensure_csrf_cookie
def getCSRFToken(request):
    return JsonResponse({}, status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_protect, name='post')
class ValidatePhoneAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = serializers.ValidatePhoneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
