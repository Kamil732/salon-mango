from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.vary import vary_on_headers
from django.views.decorators.cache import cache_page

from rest_framework import generics, mixins, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from server.permissions import IsAdminOrReadOnly, IsAdmin
from data.models import Business, BusinessCategory, Service, Notification, Employee, Customer, CustomerImage
from . import serializers
from . import pagination


@method_decorator(csrf_protect, name='patch')
class BusinessDetailAPIView(generics.RetrieveUpdateAPIView):
    # permission_classes = (IsAdminOrReadOnly, )
    serializer_class = serializers.BusinessSerializer
    queryset = Business.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'business_id'


@method_decorator(cache_page(60 * 60 * 2), name='get')
@method_decorator(vary_on_headers('Accept-Language'), name='get')
class BusinessCategoryListAPIView(generics.ListAPIView):
    serializer_class = serializers.BusinessCategorySerializer
    queryset = BusinessCategory.objects.all()


@method_decorator(csrf_protect, name='dispatch')
class UpdateEmployeeAPIView(generics.UpdateAPIView):
    permission_classes = (IsAdmin, )
    serializer_class = serializers.EmployeeSerializer
    queryset = Employee.objects.all()
    lookup_field = 'slug'
    lookup_url_kwarg = 'employee_slug'


@method_decorator(csrf_protect, name='create')
class CustomerImageListAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAdminOrReadOnly, )
    queryset = CustomerImage.objects.order_by('-id')
    serializer_class = serializers.CustomerImageSerializer
    pagination_class = pagination.CustomerImagesPagination

    def create(self, request, *args, **kwargs):
        data = []
        field_ids = []

        for (key, value) in request.data.items():
            field = key.split('-')[0]
            field_id = int(key.split('-')[1])

            if field_id in field_ids:
                data[field_id][field] = value
            else:
                field_ids.append(field_id)
                data.append({
                    field: value,
                })

        serializer = self.get_serializer(data=data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data,
                        status=status.HTTP_201_CREATED,
                        headers=headers)


@method_decorator(csrf_protect, name='dispatch')
class CustomerImageDetailAPIView(mixins.UpdateModelMixin,
                                 mixins.DestroyModelMixin,
                                 generics.GenericAPIView):
    permission_classes = (IsAdmin, )
    queryset = CustomerImage.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'customer_image_id'

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class CustomerListAPIView(generics.ListCreateAPIView):
    # permission_classes = (IsAdmin,)
    serializer_class = serializers.CustomerSerializer

    def get_queryset(self):
        search_field = self.request.query_params.get('search', '')

        return Customer.objects.annotate(
            full_name=Concat('first_name', V(' '), 'last_name')).filter(
                Q(business_id=self.kwargs.get('business_id'))
                & (Q(full_name__istartswith=search_field)
                   | Q(first_name__istartswith=search_field)
                   | Q(last_name__istartswith=search_field)))[:10]


class EmployeeListAPIView(generics.ListCreateAPIView):
    # permission_classes = (IsAdminOrReadOnly,)
    serializer_class = serializers.EmployeeSerializer

    def get_queryset(self):
        return Employee.objects.filter(business_id=self.kwargs.get(
            'business_id')).prefetch_related('service_employee_data')


@method_decorator(csrf_protect, name='dispatch')
class ServiceDetailAPIView(mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                           generics.GenericAPIView):
    permission_classes = (IsAdmin, )
    queryset = Service.objects.all()
    serializer_class = serializers.ServiceSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'service_id'

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


@method_decorator(csrf_protect, name='dispatch')
class ServiceCreateAPIView(generics.CreateAPIView):
    permission_classes = (IsAdmin, )
    serializer_class = serializers.ServiceSerializer
    queryset = Service.objects.all()


class NotificationsUnreadAmountAPIView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        user_id = request.user.id

        return Response(
            Notification.objects.filter(recivers__id=user_id,
                                        read=False).count())


class NotificationListAPIView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = serializers.NotificationSerializer

    def get_queryset(self):
        user_id = self.request.user.id

        return Notification.objects.filter(
            recivers__id=user_id).order_by('-date')


@method_decorator(csrf_protect, name='update')
class NotificationDetailAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated, )
    lookup_field = 'id'
    lookup_url_kwarg = 'notification_id'

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return serializers.NotificationWriteSerializer
        return serializers.NotificationSerializer

    def get_queryset(self):
        user_id = self.request.user.id

        return Notification.objects.filter(recivers__id=user_id)
