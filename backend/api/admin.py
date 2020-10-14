from django.contrib import admin

from .models import *


# Register your models here.
class DetailAdmin(admin.ModelAdmin):
    readonly_fields = ['user', 'date_created', 'savings', 'totalExpenditure', 'totalTransactions']

    class Meta:
        model = Detail


admin.site.register(Detail, DetailAdmin)


class TransactionAdmin(admin.ModelAdmin):
    readonly_fields = ['time', 'user', 'details', 'last_updated']

    class Meta:
        model = Transaction


admin.site.register(Transaction, TransactionAdmin)
