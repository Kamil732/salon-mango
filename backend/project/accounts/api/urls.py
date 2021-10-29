from django.urls import path, include

from . import views

urlpatterns = [
    path('register/', views.RegisterAPIView.as_view(), name='register'),
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('current/',
         views.CurrentAccountAPIView.as_view(),
         name='current-account'),
    path('exists/', views.AccountExistsAPIView.as_view(), name='exists'),
]
