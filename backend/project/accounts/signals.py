from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Account
from data.models import Salon

# @receiver(post_save, sender=Account)
# def save_profile(sender, instance, created, **kwargs):
# if created:
