from rest_framework import serializers

from server.abstract.serializers import Subgroups
from data.models import Business, BusinessCategory, BlockedHours, OpenHours, Customer, Employee, Service, ServiceGroup, ServiceEmployee, Notification, Resource, ResourceGroup, ServiceRelatedData


class ResourceGroupSerializer(Subgroups):
    class Meta(Subgroups.Meta):
        model = ResourceGroup


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'


class RelatedDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRelatedData
        fields = (
            'resources',
            'products',
        )


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
    related_data = RelatedDataSerializer(many=True)

    def get_display_time(self, obj):
        hours = obj.time // 60
        minutes = obj.time % 60

        if hours:
            return f'{hours}h {minutes}min'
        return f'{minutes} min'

    class Meta:
        model = Service
        fields = '__all__'


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


class BusinessCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessCategory
        fields = (
            'name',
            'slug',
        )


class OpenHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpenHours
        exclude = (
            'id',
            'business',
        )


class BlockedHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedHours
        exclude = (
            'id',
            'business',
        )


class BusinessSerializer(serializers.ModelSerializer):
    open_hours = OpenHoursSerializer(many=True, required=False)
    blocked_hours = BlockedHoursSerializer(many=True, required=False)
    categories = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='slug',
    )

    # service_groups = serializers.SerializerMethodField('get_service_groups')
    # services = serializers.SerializerMethodField('get_services')
    # resource_groups = serializers.SerializerMethodField('get_resource_groups')
    # resources = serializers.SerializerMethodField('get_resources')

    # def get_services(self, obj):
    #     user = self.context.get('request').user
    #     serializer = ServiceSerializerAdmin if user.is_authenticated and user.is_admin else ServiceSerializerCustomer

    #     return serializer(Service.objects.filter(
    #         business_id=obj.id).select_related('group').prefetch_related(
    #             'employees', 'related_data'),
    #                       many=True).data

    # def get_service_groups(self, obj):
    #     return ServiceGroupSerializer(ServiceGroup.objects.filter(
    #         business_id=obj.id,
    #         parent=None).prefetch_related('employees', 'services'),
    #                                   many=True).data

    # def get_resources(self, obj):
    #     return ResourceSerializer(Resource.objects.filter(
    #         business_id=obj.id).select_related('group'),
    #                               many=True).data

    # def get_resource_groups(self, obj):
    #     return ResourceGroupSerializer(ResourceGroup.objects.filter(
    #         business_id=obj.id, parent=None),
    #                                    many=True).data

    # def create(self, )

    class Meta:
        model = Business
        fields = "__all__"
        extra_kwargs = {
            'owner': {
                'write_only': True
            },
        }


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


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        exclude = ('recivers', )


class NotificationWriteSerializer(NotificationSerializer):
    class Meta(NotificationSerializer.Meta):
        exclude = ()
        fields = ('read', )
