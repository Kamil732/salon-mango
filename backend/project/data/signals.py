import datetime

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Business, OpenHours


@receiver(post_save, sender=Business)
def create_business(sender, instance, created, **kwargs):
    if created:
        from_hour = datetime.time(hour=9, minute=0)
        to_hour = datetime.time(hour=17, minute=0)
        open_hours = [
            OpenHours(business=instance,
                      weekday=i,
                      from_hour=from_hour,
                      to_hour=to_hour) for i in range(1, 6)
        ]

        OpenHours.objects.bulk_create(open_hours)
