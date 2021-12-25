from django.urls import path

from data.consumers import NotificationConsumer

websocket_urlpatterns = [
    path(r'notifications/', NotificationConsumer.as_asgi()),
]
