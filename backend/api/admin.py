from django.contrib import admin

from .models import *


# Register your models here.
class DetailAdmin(admin.ModelAdmin):
    readonly_fields = ['savings', 'totalExpenditure', 'totalTransactions']

    class Meta:
        model = Detail


admin.site.register(Detail, DetailAdmin)


class TransactionAdmin(admin.ModelAdmin):
    readonly_fields = ['time', 'user']

    class Meta:
        model = Transaction


admin.site.register(Transaction, TransactionAdmin)
