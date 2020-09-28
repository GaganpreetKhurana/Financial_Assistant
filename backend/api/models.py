from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class Detail(models.Model):
    user = models.OneToOneField(User, verbose_name="USER", on_delete=models.CASCADE)
    income = models.FloatField(verbose_name="INCOME")
    savings = models.FloatField(verbose_name="SAVINGS")
    totalExpenditure = models.FloatField(verbose_name="TOTAL EXPENDITURE")
    housing = models.FloatField(verbose_name="HOUSING")
    food = models.FloatField(verbose_name="FOOD")
    healthcare = models.FloatField(verbose_name="HEALTHCARE")
    transportation = models.FloatField(verbose_name="TRANSPORTATION")
    recreation = models.FloatField(verbose_name="RECREATION")
    miscellaneous = models.FloatField(verbose_name="MISCELLANEOUS")
    totalTransactions = models.IntegerField(verbose_name="TOTAL TRANSACTIONS")

    def __str__(self):
        return str(self.user)


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
    amount = models.FloatField(verbose_name="AMOUNT")
    type = models.IntegerField(choices=categories, verbose_name="Type")

    def __str__(self):
        return str(self.user) + " / " + str(self.time) + " / " + str(self.amount) + " / " + categories[self.type][1]
