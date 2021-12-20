from rest_framework import serializers

from server.abstract.serializers import Subgroups
from server.abstract.models import COLORS
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


class RegisterSerivceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = (
            'name',
            'price',
            'price_type',
            'time',
            'is_mobile',
        )


class RegisterEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = (
            'name',
            'email',
            'phone_number',
            'position',
        )


class BusinessSerializer(serializers.ModelSerializer):
    open_hours = OpenHoursSerializer(many=True)
    blocked_hours = BlockedHoursSerializer(many=True)
    categories = serializers.SlugRelatedField(
        many=True,
        queryset=BusinessCategory.objects.all(),
        slug_field='slug',
    )
    services = RegisterSerivceSerializer(many=True)
    employees = RegisterEmployeeSerializer(many=True)

    def create(self, validated_data):
        open_hours = validated_data.pop('open_hours')
        blocked_hours = validated_data.pop('blocked_hours')
        categories = validated_data.pop('categories')
        services = validated_data.pop('services')
        employees = validated_data.pop('employees')
        business = Business.objects.create(**validated_data)

        # Create nested objects
        open_hours_models = []
        for open_hour in open_hours:
            open_hours_models.append(OpenHours(business=business, **open_hour))
        OpenHours.objects.bulk_create(open_hours_models)

        blocked_hours_models = []
        for blocked_hour in blocked_hours:
            blocked_hours_models.append(
                BlockedHours(business=business, **blocked_hour))
        BlockedHours.objects.bulk_create(blocked_hours_models)

        services_models = []
        for service in services:
            services_models.append(Service(business=business, **service))
        Service.objects.bulk_create(services_models)

        employees_models = []
        color_idx = 0
        for employee in employees:
            employees_models.append(
                Employee(business=business,
                         color=COLORS[color_idx][0],
                         **employee))
            color_idx += 1
            if (color_idx > len(COLORS) - 1):
                color_idx = 0
        Employee.objects.bulk_create(employees_models)

        # Add categories
        business.categories.add(*categories)

        return business

    class Meta:
        model = Business
        fields = "__all__"
        extra_kwargs = {
            'services': {
                'write_only': True
            },
            'employees': {
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
