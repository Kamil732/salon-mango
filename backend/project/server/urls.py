from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, re_path, include
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include([
        path('csrf_cookie/', views.GetCSRFToken.as_view(), name='set-csrf-cookie'),
        path('accounts/', include('accounts.api.urls')),
        path('meetings/', include('meetings.api.urls')),
        path('data/', include('data.api.urls')),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
