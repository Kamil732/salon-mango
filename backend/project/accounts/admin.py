from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.admin import ModelAdmin
from django.forms import ModelForm
from django.contrib.auth.hashers import make_password, check_password

from .models import Account


class UserCreationForm(ModelForm):
    class Meta:
        model = Account
        fields = '__all__'

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password"])

        if commit:
            user.save()

        return user


@admin.register(Account)
class AccountAdmin(ModelAdmin):
    form = UserCreationForm
    empty_value_display = '--empty--'
    readonly_fields = ('id', )


# admin.site.unregister(Group)
