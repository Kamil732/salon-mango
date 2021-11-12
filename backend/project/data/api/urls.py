from django.urls import path, include

from . import views

urlpatterns = [
    path('buisness-categories/',
         views.BusinessCategoryListAPIView.as_view(),
         name='business-category-list'),
    path(
        'businesses/',
        include([
            path('',
                 views.BusinessCreateListAPIView.as_view(),
                 name='business-list'),
            path(
                '<int:business_id>/',
                include([
                    path('',
                         views.BusinessDetailAPIView.as_view(),
                         name='business-detail'),
                    path(
                        'customers/',
                        include([
                            path('',
                                 views.CustomerListAPIView.as_view(),
                                 name='customer-list'),
                            path('<int:customer_id>/',
                                 views.CustomerDetailAPIView.as_view(),
                                 name="customer-detail")
                        ])),
                    path(
                        'employees/',
                        include([
                            path('<slug:employee_slug>/',
                                 views.UpdateEmployeeAPIView.as_view(),
                                 name='update-employee'),
                        ])),
                ]))
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
