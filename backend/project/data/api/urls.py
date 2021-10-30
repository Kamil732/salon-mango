from django.urls import path, include

from . import views

urlpatterns = [
    path(
        'gallery/',
        include([
            path('',
                 views.CustomerImageListAPIView.as_view(),
                 name='gallery-list'),
            path('<int:id>/',
                 views.CustomerImageDetailAPIView.as_view(),
                 name='gallery-detail'),
        ])),
    path('buisness-categories/',
         views.BusinessCategoryListAPIView.as_view(),
         name='business-category-list'),
    path(
        'businesses/<int:business_id>/',
        include([
            path('',
                 views.BusinessDetailAPIView.as_view(),
                 name='business-detail'),
            path('customers/',
                 views.CustomerListAPIView.as_view(),
                 name='customer-list'),
            path(
                'employees/',
                include([
                    path('',
                         views.EmployeeListAPIView.as_view(),
                         name='employee-list'),
                    path('<slug:employee_slug>/',
                         views.UpdateEmployeeAPIView.as_view(),
                         name='update-employee'),
                ])),
        ])),
    path(
        'services/',
        include([
            path('',
                 views.ServiceCreateAPIView.as_view(),
                 name='create-service'),
            path('<int:service_id>/',
                 views.ServiceDetailAPIView.as_view(),
                 name='detail-service'),
        ])),
    path(
        'notifications/',
        include([
            path('',
                 views.NotificationListAPIView.as_view(),
                 name='notification-list'),
            path('<int:notification_id>/',
                 views.NotificationDetailAPIView.as_view(),
                 name='notification-detail'),
            path('unread-amount/',
                 views.NotificationsUnreadAmountAPIView.as_view(),
                 name='notification-unread-amount'),
        ])),
]
