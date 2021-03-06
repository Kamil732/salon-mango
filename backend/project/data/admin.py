from django.contrib import admin
from django.contrib.admin import ModelAdmin, TabularInline

from .models import (
    Customer,
    Employee,
    Business,
    BusinessCategory,
    OpenHours,
    BlockedHours,
    Notification,
    Resource,
    ResourceGroup,
    ServiceRelatedData,
    Service,
    ServiceGroup,
    ServiceEmployee,
    ServiceImage,
    ProductGroup,
    Producer,
    Product,
)


@admin.register(BusinessCategory)
class BusinessCategoryAdmin(ModelAdmin):
    readonly_fields = (
        "id",
        "slug",
    )


class OpenHoursAdmin(TabularInline):
    model = OpenHours
    readonly_fields = ("id", )


class BlockedHoursAdmin(TabularInline):
    model = BlockedHours
    readonly_fields = ("id", )


@admin.register(Business)
class BusinessAdmin(ModelAdmin):
    readonly_fields = ("id", )
    inlines = (OpenHoursAdmin, BlockedHoursAdmin)


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


@admin.register(ServiceRelatedData)
class ServiceRelatedDataAdmin(ModelAdmin):
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
