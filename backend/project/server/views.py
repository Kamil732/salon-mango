from django.http.response import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import status


@ensure_csrf_cookie
def getCSRFToken(request):
    return JsonResponse({}, status=status.HTTP_204_NO_CONTENT)
