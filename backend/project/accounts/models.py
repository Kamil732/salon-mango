from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class AccountManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Users must have an email")

        user = self.model(email=self.normalize_email(email), )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        user = self.create_user(
            email=email,
            password=password,
        )
        user.is_active = True
        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user


class Account(AbstractBaseUser):
    salons = models.ManyToManyField('data.Salon')
    email = models.EmailField(verbose_name="E-mail adres",
                              max_length=80,
                              unique=True)
    is_active = models.BooleanField(verbose_name="Jest aktywowany?",
                                    default=True)
    is_admin = models.BooleanField(verbose_name="Jest adminem?", default=False)
    is_staff = models.BooleanField(verbose_name="Ma uprawnienia?",
                                   default=False)
    is_superuser = models.BooleanField(
        verbose_name="Jest super urzytkownikiem?", default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = AccountManager()

    def __str__(self):
        if hasattr(self, "profile"):
            return self.profile
        return self.email

    @property
    def room_name(self):
        return f"user_{self.id}"

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser
