from django.contrib.auth.models import User
from django.db import models

from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail


# Create your models here.
class Detail(models.Model):
    user = models.OneToOneField(User, verbose_name="USER", on_delete=models.CASCADE)
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

    def __str__(self):
        return str(self.user)

    def get_username(self):
        return self.user.username


categories = [
    (0, "Income"),
    (1, "Housing"),
    (2, "Food"),
    (3, "Healthcare"),
    (4, "Transportation"),
    (5, "Recreation"),
    (6, "Miscellaneous")
]


class Transaction(models.Model):
    user = models.OneToOneField(User, verbose_name="USER", on_delete=models.CASCADE)
    details = models.ForeignKey(Detail, on_delete=models.CASCADE, verbose_name="DETAILS")
    time = models.DateTimeField(auto_now=True)
    amount = models.FloatField(verbose_name="AMOUNT", default=0)
    type = models.IntegerField(choices=categories, verbose_name="Type")

    def __str__(self):
        return str(self.user) + " / " + str(self.time) + " / " + str(self.amount) + " / " + categories[self.type][1]

    def get_category(self):
        return categories[self.type][1]

    def get_username(self):
        return self.user.username


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
