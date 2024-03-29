from datetime import datetime, timedelta

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework import generics, permissions
from rest_framework.response import Response

from server.permissions import IsOwnerOrIsAdminOrReadOnly
from data.models import Notification
from meetings.models import Meeting
from accounts.models import Account
from . import serializers


@method_decorator(csrf_protect, name='create')
class MeetingListAPIView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = serializers.MeetingSerializer

    # def get_serializer_class(self):
    #     if self.request.user.is_authenticated and self.request.user.is_admin:
    #         return serializers.AdminMeetingSerializer
    #     return serializers.CustomerMeetingSerializer

    def get_queryset(self):
        # Get date start of week
        today = datetime.today()
        monday = today - timedelta(days=today.weekday())

        from_ = datetime.strptime(self.request.query_params.get('from', today),
                                  '%Y-%m-%d')
        to = datetime.strptime(
            self.request.query_params.get('to', monday + timedelta(days=7)),
            '%Y-%m-%d') + timedelta(days=1)

        return Meeting.objects.filter(
            business_id=self.kwargs['business_id'],
            start__gte=from_,
            start__lte=to).select_related(
                'customer', 'employee',
                'resource').prefetch_related('services')

    def perform_create(self, serializer):
        serializer.save(business_id=self.kwargs['business_id'])


@method_decorator(csrf_protect, name='update')
@method_decorator(csrf_protect, name='destroy')
class MeetingDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    # permission_classes = (IsOwnerOrIsAdminOrReadOnly, )
    queryset = Meeting.objects.select_related(
        'customer', 'employee', 'resource').prefetch_related('services')
    lookup_field = 'id'
    lookup_url_kwarg = 'meeting_id'
    serializer_class = serializers.MeetingSerializer

    # def get_serializer_context(self):
    #     context = super(MeetingDetailAPIView, self).get_serializer_context()
    #     context['meeting_id'] = self.kwargs.get('meeting_id')

    #     return context

    # def perform_destroy(self, instance):
    #     user = self.request.user
    #     customer_account = getattr(instance.customer, 'account', None)
    #     date = datetime.strftime(instance.start, '%d.%m.%Y')
    #     time = datetime.strftime(instance.start, '%H:%M')

    #     # Delete object
    #     super().perform_destroy(instance)

    #     if customer_account:
    #         channel_layer = get_channel_layer()

    #         if user.is_authenticated and user.is_admin:
    #             notify = Notification.objects.create(
    #                 title='Odmówiono wizytę',
    #                 message=f"""
    #                     Została odmówiona wizyta z dnia {date}
    #                     o godzinie {time}.
    #                     W celu uzyskania więcej informacji prosimy o kontakt
    #                 """,
    #             )
    #             notify.save()
    #             notify.recivers.add(customer_account)

    #             async_to_sync(channel_layer.group_send)(
    #                 customer_account.room_name, {
    #                     'type': 'send_data',
    #                     'event': 'GET_NOTIFICATION',
    #                     'payload': notify.id,
    #                 })
    #         elif customer_account == user:
    #             admins = Account.objects.filter(is_admin=True)

    #             notify = Notification.objects.create(
    #                 title=f'{user} odmówił wizytę',
    #                 message=f"""
    #                     {user} odmówił wizytę z dnia {date}
    #                     o godzinie {time}.
    #                 """,
    #             )
    #             notify.save()
    #             notify.recivers.add(*admins)

    #             for admin in admins:
    #                 async_to_sync(channel_layer.group_send)(
    #                     admin.room_name, {
    #                         'type': 'send_data',
    #                         'event': 'GET_NOTIFICATION',
    #                         'payload': notify.id,
    #                     })
