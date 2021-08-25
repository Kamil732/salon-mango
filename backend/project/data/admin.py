from django.contrib import admin
from django.contrib.admin import ModelAdmin, TabularInline

from .models import (
    Data,
    Notification,
    Resource,
    ResourceGroup,
    ServiceResources,
    Service,
    ServiceGroup,
    ServiceBarber,
    ServiceImage,
    ProductGroup,
    Producer,
    Product,
)


@admin.register(Data)
class DataAdmin(ModelAdmin):
    readonly_fields = ("one_slot_max_meetings",)

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ServiceGroup)
class ServiceGroupAdmin(ModelAdmin):
    readonly_fields = ("id",)


class ServiceImageAdmin(TabularInline):
    model = ServiceImage
    readonly_fields = ("id",)


@admin.register(Service)
class ServiceAdmin(ModelAdmin):
    readonly_fields = ("id",)
    inlines = (ServiceImageAdmin,)


@admin.register(ServiceBarber)
class ServiceBarberAdmin(ModelAdmin):
    readonly_fields = ("id",)


@admin.register(ResourceGroup)
class ResourceGroupAdmin(ModelAdmin):
    readonly_fields = ("id",)


@admin.register(Resource)
class ResourceAdmin(ModelAdmin):
    readonly_fields = ("id",)


@admin.register(ServiceResources)
class ServiceResourcesAdmin(ModelAdmin):
    readonly_fields = ("id",)


@admin.register(ProductGroup)
class ProductGroupAdmin(ModelAdmin):
    readonly_fields = ("id",)


@admin.register(Producer)
class ProducerAdmin(ModelAdmin):
    readonly_fields = ("id",)


@admin.register(Product)
class ProductAdmin(ModelAdmin):
    readonly_fields = ("id",)


@admin.register(Notification)
class NotificationAdmin(ModelAdmin):
    list_display = (
        "title",
        "date",
        "read",
    )
    readonly_fields = ("date",)
    list_editable = ("read",)
