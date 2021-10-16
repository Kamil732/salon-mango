from rest_framework import serializers

from server.abstract.serializers import Subgroups
from data.models import Salon, BlockedHours, OpenHours, Customer, CustomerImage, Employee, Service, ServiceGroup, ServiceEmployee, Notification, Resource, ResourceGroup, ServiceResources


class ResourceGroupSerializer(Subgroups):
    class Meta(Subgroups.Meta):
        model = ResourceGroup


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'


class ServiceResourcesSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)

        return data['resources']

    class Meta:
        model = ServiceResources
        fields = ('resources', )


class ServiceEmployeeSerializer(serializers.ModelSerializer):
    display_time = serializers.SerializerMethodField('get_display_time')

    def get_display_time(self, obj):
        hours = obj.time // 60
        minutes = obj.time % 60

        if hours:
            return f'{hours}h {minutes}min'
        return f'{minutes} min'

    class Meta:
        model = ServiceEmployee
        fields = (
            'display_time',
            'time',
            'service',
        )


class ServiceSerializer(serializers.ModelSerializer):
    display_time = serializers.SerializerMethodField('get_display_time')
    resources = ServiceResourcesSerializer(source='resources_data', many=True)

    def get_display_time(self, obj):
        hours = obj.time // 60
        minutes = obj.time % 60

        if hours:
            return f'{hours}h {minutes}min'
        return f'{minutes} min'

    class Meta:
        model = Service


class ServiceSerializerAdmin(ServiceSerializer):
    class Meta(ServiceSerializer.Meta):
        fields = '__all__'


class ServiceSerializerCustomer(ServiceSerializer):
    class Meta(ServiceSerializer.Meta):
        exclude = (
            'private_description',
            'choosen_times',
        )


class ServiceGroupSerializer(Subgroups):
    services = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta(Subgroups.Meta):
        model = ServiceGroup


class OpenHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpenHours
        exclude = ('id', 'salon',)

class BlockedHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedHours
        exclude = ('id', 'salon',)


class SalonSerializer(serializers.ModelSerializer):
    open_hours = OpenHoursSerializer(many=True)
    blocked_hours = BlockedHoursSerializer(many=True)
    service_groups = serializers.SerializerMethodField('get_service_groups')
    services = serializers.SerializerMethodField('get_services')
    resource_groups = serializers.SerializerMethodField('get_resource_groups')
    resources = serializers.SerializerMethodField('get_resources')

    def get_services(self, obj):
        user = self.context.get('request').user
        serializer = ServiceSerializerAdmin if user.is_authenticated and user.is_admin else ServiceSerializerCustomer

        return serializer(Service.objects.filter(
            salon_id=obj.id).select_related('group').prefetch_related(
                'employees', 'resources_data'),
                          many=True).data

    def get_service_groups(self, obj):
        return ServiceGroupSerializer(ServiceGroup.objects.filter(
            salon_id=obj.id,
            parent=None).prefetch_related('employees', 'services'),
                                      many=True).data

    def get_resources(self, obj):
        return ResourceSerializer(
            Resource.objects.filter(salon_id=obj.id).select_related('group'),
            many=True).data

    def get_resource_groups(self, obj):
        return ResourceGroupSerializer(ResourceGroup.objects.filter(
            salon_id=obj.id, parent=None),
                                       many=True).data

    class Meta:
        model = Salon
        fields = "__all__"



class CustomerSerializer(serializers.ModelSerializer):
    # account = AccountSerializer()
    full_name = serializers.ReadOnlyField(source='get_full_name')

    class Meta:
        model = Customer
        # fields = '__all__'
        exclude = ('account', )


class EmployeeSerializer(serializers.ModelSerializer):
    services_data = ServiceEmployeeSerializer(source='service_employee_data',
                                              many=True)
    full_name = serializers.ReadOnlyField(source='get_full_name')

    class Meta:
        model = Employee
        fields = '__all__'


class CustomerImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerImage
        fields = (
            'image',
            'title',
            'id',
        )


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        exclude = ('recivers', )


class NotificationWriteSerializer(NotificationSerializer):
    class Meta(NotificationSerializer.Meta):
        exclude = ()
        fields = ('read', )
