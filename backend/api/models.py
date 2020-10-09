from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.db import models

from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail

# Create your models here.

User._meta.get_field('email')._unique = True
User._meta.get_field('email').blank = False
User._meta.get_field('email').null = False

User._meta.get_field('first_name').blank = False
User._meta.get_field('first_name').null = False

User._meta.get_field('last_name').blank = False
User._meta.get_field('last_name').null = False


class Detail(models.Model):
    user = models.OneToOneField(User, verbose_name="USER", on_delete=models.CASCADE, unique_for_month="date_created")
    income = models.FloatField(verbose_name="INCOME", default=0)
    savings = models.FloatField(verbose_name="SAVINGS", default=0)
    totalExpenditure = models.FloatField(verbose_name="TOTAL EXPENDITURE", default=0)
    housing = models.FloatField(verbose_name="HOUSING", default=0)
    food = models.FloatField(verbose_name="FOOD", default=0)
    healthcare = models.FloatField(verbose_name="HEALTHCARE", default=0)
    transportation = models.FloatField(verbose_name="TRANSPORTATION", default=0)
    recreation = models.FloatField(verbose_name="RECREATION", default=0)
    miscellaneous = models.FloatField(verbose_name="MISCELLANEOUS", default=0)
    totalTransactions = models.IntegerField(verbose_name="TOTAL TRANSACTIONS", default=0)
    date_created = models.DateField(auto_now_add=True, null=True)

    def __str__(self):
        return str(self.user) + " / " + str(self.get_month) + " / " + str(self.get_year)

    def get_username(self):
        return self.user.username

    @property
    def get_month(self):
        return self.date_created.strftime("%m")

    @property
    def get_year(self):
        return self.date_created.strftime("%Y")

    @property
    def get_date(self):
        return self.date_created.strftime("%d")


categories = [
    (0, "Income"),
    (1, "Housing"),
    (2, "Food"),
    (3, "Healthcare"),
    (4, "Transportation"),
    (5, "Recreation"),
    (6, "Miscellaneous"),
    (7, "Other")
]


class Transaction(models.Model):
    user = models.ForeignKey(User, verbose_name="USER", on_delete=models.CASCADE, blank=False, null=False)
    details = models.ForeignKey(Detail, on_delete=models.CASCADE, verbose_name="DETAILS",
                                blank=False, null=False)
    time = models.DateTimeField(auto_now=True)
    amount = models.FloatField(verbose_name="AMOUNT", default=0, blank=False, null=False)
    type = models.IntegerField(choices=categories, verbose_name="Type", blank=False, null=False)
    credit = models.BooleanField(verbose_name="CREDIT", default=False, blank=False, null=False)
    description = models.TextField(blank=True, default="No Description Provided!", verbose_name="DESCRIPTION")

    def __str__(self):
        return str(self.user) + " / " + str(self.time) + " / " + str(self.amount) + " / " + categories[self.type][
            1] + " / " + self.description

    def get_category(self):
        return categories[self.type][1]

    def get_username(self):
        return self.user.username

    @property
    def get_month(self):
        return self.time.strftime("%m")

    @property
    def get_year(self):
        return self.time.strftime("%Y")

    @property
    def get_date(self):
        return self.time.strftime("%d")

    def clean(self):
        if self.details.user != self.user:
            raise ValidationError(_('User does not own this Detail'))
        if self.details.get_month != self.get_month or self.details.get_year != self.get_year:
            raise ValidationError(_('Time of transaction and details do not match'))


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    email_plaintext_message = "{}?token={}".format(reverse('password_reset:reset-password-request'),
                                                   reset_password_token.key)

    send_mail(
        # title:
        subject="Password Reset for {title}".format(title="DONNA"),
        # message:
        message=email_plaintext_message,
        # from:
        from_email="noreply@donna.local",
        # to:
        recipient_list=[reset_password_token.user.email],
        fail_silently=False

    )
