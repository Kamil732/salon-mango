from django.db.models.base import Model
from django.db import models
from django.core.exceptions import ValidationError

from datetime import timedelta


def get_meeting_logo_location(self, filename):
    return f"meetings/{self.name}/logo"


def get_meeting_bg_image_location(self, filename):
    return f"meetings/{self.name}/bg"


class Meeting(models.Model):
    logo = models.ImageField(upload_to=get_meeting_logo_location,
                             blank=True,
                             null=True)
    bg_image = models.ImageField(upload_to=get_meeting_bg_image_location,
                                 blank=True,
                                 null=True)

    business = models.ForeignKey('data.Business',
                                 on_delete=models.CASCADE,
                                 related_name='meetings')
    employee = models.ForeignKey(
        verbose_name="Fryzjer",
        to="data.Employee",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="meetings",
    )
    resource = models.ForeignKey(
        "data.Resource",
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name="meetings",
    )
    customer = models.ForeignKey(
        verbose_name="Klient",
        to="data.Customer",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="meetings",
    )
    services = models.ManyToManyField("data.Service",
                                      blank=True,
                                      through="ServiceData",
                                      related_name="meetings")
    start = models.DateTimeField(verbose_name="Zaczyna się o")
    end = models.DateTimeField(verbose_name="Kończy się o")
    description = models.TextField(blank=True)
    customer_description = models.TextField(blank=True)
    confirmed = models.BooleanField(default=False)
    customer_came = models.BooleanField(default=True)
    paid = models.BooleanField(default=False)
    pre_payment = models.DecimalField(max_digits=8,
                                      decimal_places=2,
                                      default=0)
    pre_paid = models.BooleanField(default=False)
    products_sold = models.ManyToManyField("data.Product",
                                           through="ProductSale",
                                           blank=True)
    sold_by = models.ForeignKey(
        "data.Employee",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="sold_meetings",
    )
    payments = models.ManyToManyField("data.PaymentMethod",
                                      through="Payment",
                                      blank=True)

    def __str__(self):
        return f"{self.employee} - {self.customer} - {self.id}"

    def clean(self):
        if self.end and self.end <= self.start:
            raise ValidationError("Niepoprawna data wizyty")

    def save(self, *args, **kwargs):
        if not (self.end):
            self.end = self.start + timedelta(minutes=30)

        return super(Meeting, self).save(*args, **kwargs)


class Payment(models.Model):
    meeting = models.ForeignKey('Meeting', on_delete=models.DO_NOTHING)
    method = models.ForeignKey("data.PaymentMethod", on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=8, decimal_places=2)


class ProductSale(models.Model):
    UNIT = (
        (2, "Sztuki"),
        (1, "Jednoskti"),
    )

    product = models.ForeignKey("data.Product", on_delete=models.DO_NOTHING)
    meeting = models.ForeignKey('Meeting', on_delete=models.DO_NOTHING)
    item_price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField(default=0)
    vat = models.DecimalField(max_digits=4, decimal_places=2)
    unit = models.PositiveSmallIntegerField(choices=UNIT, default=1)


class ServiceData(models.Model):
    DISCOUNT_TYPE = ((2, "Pieniądze"), (1, "%"))

    meeting = models.ForeignKey('Meeting',
                                on_delete=models.CASCADE,
                                related_name="services_data")
    start = models.DateTimeField(verbose_name="Zaczyna się o")
    end = models.DateTimeField(verbose_name="Kończy się o")
    service = models.ForeignKey("data.Service",
                                on_delete=models.CASCADE,
                                related_name="services_data")
    employee = models.ForeignKey("data.Employee",
                                 on_delete=models.CASCADE,
                                 related_name="services_data")
    resources = models.ManyToManyField("data.Resource",
                                       blank=True,
                                       related_name="services_data")
    price = models.DecimalField(max_digits=8, decimal_places=2)
    discount = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    discount_type = models.PositiveSmallIntegerField(choices=DISCOUNT_TYPE,
                                                     default=1,
                                                     blank=True,
                                                     null=True)
    products_used = models.ManyToManyField("data.Product",
                                           through="ProductUsed",
                                           blank=True)

    def __str__(self):
        return f"{self.meeting} - {self.service}"


class ProductUsed(models.Model):
    UNIT = (
        (2, "Sztuki"),
        (1, "Jednoskti"),
    )

    product = models.ForeignKey("data.Product", on_delete=models.CASCADE)
    service_data = models.ForeignKey('ServiceData', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    unit = models.PositiveSmallIntegerField(choices=UNIT, default=1)
