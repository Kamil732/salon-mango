from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.vary import vary_on_headers
from django.views.decorators.cache import cache_page

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from server.permissions import IsAdmin
from data.models import Business, BusinessCategory, Service, ServiceGroup, Resource, ResourceGroup, Notification, Employee, Customer
from . import serializers


@method_decorator(cache_page(60 * 60 * 2), name='get')
@method_decorator(vary_on_headers('Accept-Language'), name='get')
class BusinessCategoryListAPIView(generics.ListAPIView):
    serializer_class = serializers.BusinessCategorySerializer
    queryset = BusinessCategory.objects.all()


@method_decorator(csrf_protect, name='post')
class BusinessCreateListAPIView(generics.ListCreateAPIView):
    serializer_class = serializers.BusinessSerializer
    queryset = Business.objects.all()
    permission_classes = (IsAuthenticated, )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Add business to the user
        request.user.businesses.add(serializer.data['id'])

        return Response(serializer.data,
                        status=status.HTTP_201_CREATED,
                        headers=headers)


@method_decorator(csrf_protect, name='patch')
class BusinessDetailAPIView(generics.RetrieveUpdateAPIView):
    # permission_classes = (IsAdminOrReadOnly, )
    serializer_class = serializers.BusinessSerializer
    queryset = Business.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'business_id'

    def retrieve(self, request, *args, **kwargs):
        business_id = self.kwargs.get(self.lookup_url_kwarg)
        instance = self.get_object()

        business_serializer = self.get_serializer(instance)

        employees_serializer = serializers.EmployeeSerializer(
            Employee.objects.filter(business_id=business_id).prefetch_related(
                'service_employee_data'),
            many=True)

        service_groups_serializer = serializers.ServiceGroupSerializer(
            ServiceGroup.objects.filter(business_id=business_id,
                                        parent=None).prefetch_related(
                                            'employees', 'services'),
            many=True)
        services_serializer = serializers.ServiceSerializer(
            Service.objects.filter(business_id=business_id).select_related(
                'group').prefetch_related('employees', 'related_data'),
            many=True)

        resource_groups_serializer = serializers.ResourceGroupSerializer(
            ResourceGroup.objects.filter(business_id=business_id, parent=None),
            many=True)
        resources_serializer = serializers.ResourceSerializer(
            Resource.objects.filter(
                business_id=business_id).select_related('group'),
            many=True)

        return Response({
            'data': business_serializer.data,
            'employees': employees_serializer.data,
            'resource_groups': resource_groups_serializer.data,
            'resources': resources_serializer.data,
            'service_groups': service_groups_serializer.data,
            'services': services_serializer.data,
        })


@method_decorator(csrf_protect, name='dispatch')
class UpdateEmployeeAPIView(generics.UpdateAPIView):
    permission_classes = (IsAdmin, )
    serializer_class = serializers.EmployeeSerializer
    queryset = Employee.objects.all()
    lookup_field = 'slug'
    lookup_url_kwarg = 'employee_slug'


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


class CustomerDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    # permission_classes = (IsAdmin,)
    serializer_class = serializers.CustomerSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'customer_id'

    def get_queryset(self):
        return Customer.objects.filter(
            business_id=self.kwargs.get('business_id'))


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
