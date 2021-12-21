from data.models import Employee, ServiceGroup, Service, ResourceGroup, Resource

from data.api import serializers


class BusinessResponse(object):
    def get_business_response(self, data, business_id):
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

        return {
            'data': data,
            'employees': employees_serializer.data,
            'resource_groups': resource_groups_serializer.data,
            'resources': resources_serializer.data,
            'service_groups': service_groups_serializer.data,
            'services': services_serializer.data,
        }