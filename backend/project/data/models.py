from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from autoslug import AutoSlugField

from server.abstract.models import Group, Color
from accounts.models import Account
from meetings.models import Meeting


class BusinessCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = AutoSlugField(populate_from='name', unique=True)

    def __str__(self):
        return self.name


class Hours(models.Model):
    WEEKDAYS = (
        (0, 'Sunday'),
        (1, 'Monday'),
        (2, 'Tuesday'),
        (3, 'Wednesday'),
        (4, 'Thursday'),
        (5, 'Friday'),
        (6, 'Saturday'),
    )

    weekday = models.PositiveSmallIntegerField(choices=WEEKDAYS)
    from_hour = models.TimeField()
    to_hour = models.TimeField()

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.get_weekday_display()} {self.from_hour} - {self.to_hour}"


class OpenHours(Hours):
    business = models.ForeignKey(
        'Business',
        on_delete=models.CASCADE,
        related_name='open_hours',
    )

    class Meta:
        ordering = ('weekday', 'from_hour')
        unique_together = ('weekday', 'business')


class BlockedHours(Hours):
    business = models.ForeignKey(
        'Business',
        on_delete=models.CASCADE,
        related_name='blocked_hours',
    )

    class Meta:
        ordering = ('weekday', 'from_hour')


class Business(models.Model):
    DATE_FORMAT = (
        ('DD/MM/YYYY', 'dd/mm/yyyy'),
        ('DD.MM.YYYY', 'dd.mm.yyyy'),
        ('DD-MM-YYYY', 'dd-mm-yyyy'),
        ('MM/DD/YYYY', 'mm/dd/yyyy'),
        ('YYYY-MM-DD', 'yyyy-mm-dd'),
    )

    TIME_FORMAT = (
        (24, '24h'),
        (12, '12h'),
    )

    active_from = models.DateTimeField(null=True, blank=True)
    name = models.CharField(default='Your business', max_length=100)
    description = models.TextField(max_length=1000, blank=True)
    logo = models.ImageField(upload_to='business_logos', blank=True)
    calling_code = models.CharField(max_length=3)
    phone_number = PhoneNumberField(blank=True)
    website = models.URLField(blank=True)

    country = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=100, blank=True)
    premises_number = models.CharField(max_length=10, blank=True)
    city = models.CharField(max_length=100, blank=True)
    zipcode = models.CharField(max_length=6, blank=True)
    timezone = models.CharField(max_length=100,
                                default='+0000')  # ex. '+0000', '+0200'
    share_premises = models.BooleanField(default=False)
    common_premises_name = models.CharField(max_length=100, blank=True)
    common_premises_number = models.CharField(max_length=10, blank=True)

    currency = models.CharField(max_length=3, default='EUR')
    date_format = models.CharField(max_length=10,
                                   choices=DATE_FORMAT,
                                   default=DATE_FORMAT[0][0])
    time_format = models.PositiveSmallIntegerField(choices=TIME_FORMAT,
                                                   default=24)

    meeting_bail = models.DecimalField(decimal_places=2,
                                       default=10,
                                       max_digits=4)
    meeting_prepayment = models.DecimalField(decimal_places=2,
                                             default=15,
                                             max_digits=4)
    free_cancel_hours = models.PositiveSmallIntegerField(default=2)
    calendar_step = models.PositiveSmallIntegerField(default=15)
    calendar_timeslots = models.PositiveSmallIntegerField(default=4)
    categories = models.ManyToManyField('BusinessCategory',
                                        related_name='businesses')

    def __str__(self):
        return self.name


class Customer(models.Model):
    business = models.ForeignKey(Business,
                                 on_delete=models.CASCADE,
                                 related_name='customers')
    account = models.OneToOneField(
        'accounts.Account',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="profile",
    )
    first_name = models.CharField(verbose_name="Imię", max_length=20)
    last_name = models.CharField(verbose_name="Nazwisko", max_length=20)
    phone_number = PhoneNumberField(verbose_name="Numer telefonu")
    fax_number = PhoneNumberField(verbose_name="Zapasowy Numer telefonu",
                                  blank=True)
    bookings = models.PositiveIntegerField(default=0)
    no_shows = models.PositiveIntegerField(default=0)
    revenue = models.PositiveIntegerField(default=0)
    trusted = models.BooleanField(default=False)
    slug = AutoSlugField(populate_from="first_name", unique=True)

    def __str__(self):
        return self.get_full_name()

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"


class Employee(Color):
    business = models.ForeignKey(Business,
                                 on_delete=models.CASCADE,
                                 related_name='employees')
    name = models.CharField(verbose_name="Imię", max_length=20)
    email = models.EmailField(max_length=100, unique=True)
    phone_number = PhoneNumberField()
    position = models.CharField(max_length=100, blank=True)
    slug = AutoSlugField(populate_from="name", unique=True)

    class Meta:
        unique_together = ('business', 'name')

    def __str__(self):
        return self.name


class PaymentMethod(models.Model):
    business = models.ForeignKey(Business,
                                 on_delete=models.CASCADE,
                                 related_name='payment_methods')
    name = models.CharField(max_length=50)
    firm_salary = models.BooleanField(default=True)
    employees_salary = models.BooleanField(default=True)


class ServiceGroup(Group):
    business = models.ForeignKey(Business,
                                 on_delete=models.CASCADE,
                                 related_name='service_groups')
    employees = models.ManyToManyField(Employee, related_name="service_groups")


class Service(models.Model):
    business = models.ForeignKey(Business,
                                 on_delete=models.CASCADE,
                                 related_name='services')
    group = models.ForeignKey(
        ServiceGroup,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="services",
    )
    employees = models.ManyToManyField(Employee,
                                       through="ServiceEmployee",
                                       related_name="services")
    name = models.CharField(max_length=25)
    time = models.PositiveIntegerField(default=0)
    price = models.DecimalField(decimal_places=2, max_digits=5)
    vat = models.DecimalField(max_digits=4, decimal_places=2)
    choosen_times = models.PositiveIntegerField(default=0)
    private_description = models.TextField(blank=True)
    public_description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} - {self.price} zł"


class ServiceRelatedData(models.Model):
    service = models.ForeignKey(Service,
                                on_delete=models.CASCADE,
                                related_name="related_data")
    resources = models.ManyToManyField("Resource", related_name="related_data")
    products = models.ManyToManyField("Product", related_name="related_data")


class ServiceImage(models.Model):
    service = models.ForeignKey(Service,
                                on_delete=models.CASCADE,
                                related_name="images")
    image = models.ImageField(upload_to="service_images/%Y/%m/%d/")


class ServiceEmployee(models.Model):
    service = models.ForeignKey(Service,
                                on_delete=models.CASCADE,
                                related_name="service_employee_data")
    employee = models.ForeignKey(Employee,
                                 on_delete=models.CASCADE,
                                 related_name="service_employee_data")
    time = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.employee} - {self.service}"


class ResourceGroup(Group):
    business = models.ForeignKey(Business,
                                 on_delete=models.CASCADE,
                                 related_name='resource_groups')


class Resource(Color):
    business = models.ForeignKey(Business,
                                 on_delete=models.CASCADE,
                                 related_name='resources')
    name = models.CharField(max_length=30)
    group = models.ForeignKey(
        ResourceGroup,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="resources",
    )
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class ProductGroup(Group):
    business = models.ForeignKey(Business,
                                 on_delete=models.CASCADE,
                                 related_name='product_groups')

    def __str__(self):
        return self.name


class Producer(models.Model):
    business = models.ForeignKey(Business,
                                 on_delete=models.CASCADE,
                                 related_name='producers')
    name = models.CharField(max_length=60)

    def __str__(self):
        return self.name


class Product(models.Model):
    UNIT = (
        (8, "Pakiet"),
        (7, "Gram"),
        (6, "Uncje"),
        (5, "Mililitry"),
        (4, "Sztuki"),
        (3, "Ampułki"),
        (2, "Impulsy"),
        (1, "Jednostki"),
    )

    business = models.ForeignKey(Business,
                                 on_delete=models.CASCADE,
                                 related_name='products')
    name = models.CharField(max_length=200)
    is_ware = models.BooleanField(default=True,
                                  help_text="Produkt do odsprzedaży")
    is_material = models.BooleanField(default=False,
                                      help_text="Produkt do użytku")
    producer = models.ForeignKey(
        Producer,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="products",
    )
    group = models.ForeignKey(
        ProductGroup,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="products",
    )
    sell_price = models.DecimalField(decimal_places=2, max_digits=5)
    vat = models.DecimalField(max_digits=4, decimal_places=2)
    unit = models.PositiveSmallIntegerField(choices=UNIT, default=1)
    quantity = models.PositiveIntegerField(default=0)
    buy_price = models.DecimalField(decimal_places=2, max_digits=5)
    packing_size = models.PositiveIntegerField(default=0)
    barcode = models.CharField(max_length=12, blank=True)
    internal_code = models.CharField(max_length=20, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Notification(models.Model):
    recivers = models.ManyToManyField(Account, related_name="notifications")
    date = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=80)
    message = models.TextField()
    read = models.BooleanField(default=False)
    meeting = models.ForeignKey(Meeting,
                                on_delete=models.SET_NULL,
                                blank=True,
                                null=True)

    def __str__(self):
        title = self.title[:5]
        if len(self.title) > 5:
            title += "..."

        return title
