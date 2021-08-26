from django.contrib import admin
from django.contrib.admin import ModelAdmin, TabularInline

from .models import (
    Customer,
    CustomerImage,
    Employee,
    Salon,
    Notification,
    Resource,
    ResourceGroup,
    ServiceResources,
    Service,
    ServiceGroup,
    ServiceEmployee,
    ServiceImage,
    ProductGroup,
    Producer,
    Product,
)


@admin.register(Salon)
class SalonAdmin(ModelAdmin):
    readonly_fields = ("id", )


@admin.register(Employee)
class EmployeeAdmin(ModelAdmin):
    readonly_fields = (
        'id',
        'slug',
    )


@admin.register(Customer)
class CustomerAdmin(ModelAdmin):
    list_display = (
        'first_name',
        'last_name',
        'phone_number',
    )
    search_fields = ('first_name', 'last_name', 'phone_number', 'fax_number')
    readonly_fields = (
        'id',
        'slug',
    )


@admin.register(CustomerImage)
class CustomerImageAdmin(ModelAdmin):
    list_display = ('title', )
    search_fields = ('title', )
    readonly_fields = ('id', )


@admin.register(ServiceGroup)
class ServiceGroupAdmin(ModelAdmin):
    readonly_fields = ("id", )


class ServiceImageAdmin(TabularInline):
    model = ServiceImage
    readonly_fields = ("id", )


@admin.register(Service)
class ServiceAdmin(ModelAdmin):
    readonly_fields = ("id", )
    inlines = (ServiceImageAdmin, )


@admin.register(ServiceEmployee)
class ServiceEmployeeAdmin(ModelAdmin):
    readonly_fields = ("id", )


@admin.register(ResourceGroup)
class ResourceGroupAdmin(ModelAdmin):
    readonly_fields = ("id", )


@admin.register(Resource)
class ResourceAdmin(ModelAdmin):
    readonly_fields = ("id", )


@admin.register(ServiceResources)
class ServiceResourcesAdmin(ModelAdmin):
    readonly_fields = ("id", )


@admin.register(ProductGroup)
class ProductGroupAdmin(ModelAdmin):
    readonly_fields = ("id", )


@admin.register(Producer)
class ProducerAdmin(ModelAdmin):
    readonly_fields = ("id", )


@admin.register(Product)
class ProductAdmin(ModelAdmin):
    readonly_fields = ("id", )


@admin.register(Notification)
class NotificationAdmin(ModelAdmin):
    list_display = (
        "title",
        "date",
        "read",
    )
    readonly_fields = ("date", )
    list_editable = ("read", )
